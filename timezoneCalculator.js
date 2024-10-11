(function (global) {
    const timezoneDataUrl = 'https://raw.githubusercontent.com/eer50/tz/refs/heads/main/timezones.json';
    let timezoneData = null;

    function fetchTimezoneDataSync() {
        if (timezoneData) {
            return timezoneData;
        }

        if (typeof window !== 'undefined') {
            // Browser environment using XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('GET', timezoneDataUrl, false); // Synchronous request
            xhr.send(null);
            if (xhr.status === 200) {
                timezoneData = JSON.parse(xhr.responseText);
            } else {
                throw new Error('Failed to fetch timezone data');
            }
        } else {
            // Node.js environment using execSync
            const { execSync } = require('child_process');
            const data = execSync(`curl -s ${timezoneDataUrl}`);
            timezoneData = JSON.parse(data.toString());
        }

        return timezoneData;
    }

    function getTimezoneName(latitude, longitude) {
        const timeZoneNames = fetchTimezoneDataSync();
        for (const timeZone in timeZoneNames) {
            const tzInfo = timeZoneNames[timeZone];
            if (
                latitude >= tzInfo.latRange[0] &&
                latitude <= tzInfo.latRange[1] &&
                longitude >= tzInfo.lonRange[0] &&
                longitude <= tzInfo.lonRange[1]
            ) {
                return timeZone; // Return the timezone name
            }
        }
        return "Unknown"; // Return "Unknown" if no match is found
    }

    function calculateStandardOffset(currentOffset, dstActive) {
        const currentOffsetHours = parseFloat(currentOffset.replace('+', ''));
        return dstActive ? (currentOffsetHours - 1).toString() : currentOffset;
    }

    function formatOffset(offset, format) {
        const sign = offset.startsWith('-') ? '-' : '+';
        const absOffset = Math.abs(parseFloat(offset));
        const hours = Math.floor(absOffset);
        const minutes = (absOffset - hours) * 60;

        switch (format) {
            case 'h':
                return `${sign}${hours}`;
            case 'hh':
                return `${sign}${hours.toString().padStart(2, '0')}`;
            case 'hh:mm':
                return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            default:
                return offset; // Default format (no change)
        }
    }

    function getLocalTimeWithOffset(offset) {
        const utc = new Date();
        const localTime = new Date(utc.getTime() + offset * 60 * 60 * 1000);
        return localTime.toISOString().slice(0, 19).replace('T', ' ');
    }

    function getTimezoneInfo(latitude, longitude, offsetFormat = 'hh:mm') {
        const timeZoneNames = fetchTimezoneDataSync();
        const timezoneName = getTimezoneName(latitude, longitude);
        const tzInfo = timeZoneNames[timezoneName];

        if (tzInfo) {
            const standardOffset = calculateStandardOffset(tzInfo.offset, tzInfo.dst);
            const formattedCurrentOffset = formatOffset(tzInfo.offset, offsetFormat);
            const formattedStandardOffset = formatOffset(standardOffset, offsetFormat);

	    const currentOffsetHours = parseFloat(formattedCurrentOffset);
            const localTime = getLocalTimeWithOffset(currentOffsetHours);

            return {
                timezone: timezoneName,
                currentOffset: formattedCurrentOffset,
                standardOffset: formattedStandardOffset,
                dst: tzInfo.dst,
                abbreviation: tzInfo.abbreviation,
                currentTime: tzInfo.currentTime,
                latRange: tzInfo.latRange,
                lonRange: tzInfo.lonRange,
		current: localTime
            };
        } else {
            return {
                timezone: "Unknown",
                currentOffset: "N/A",
                standardOffset: "N/A",
                dst: false,
                abbreviation: "N/A",
                currentTime: "N/A",
                latRange: [],
                lonRange: [],
		current: "N/A"
            };
        }
    }

    // Export for Node.js or attach to window for browser
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node.js environment
        module.exports = { getTimezoneInfo };
    } else {
        // Browser environment
        global.timezoneCalculator = { getTimezoneInfo };
    }
})(typeof window !== 'undefined' ? window : global);
