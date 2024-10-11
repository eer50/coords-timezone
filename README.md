# Coords-Timezone

Coords-Timezone is a JavaScript library to calculate timezone information and local time based on latitude and longitude.

## Demo
You can check out a live demo of the library [here](https://eer50.github.io/coords-timezone/).

## Installation
You can include it directly in your HTML file using a CDN:

### Using jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/coords-timezone"></script>
```

### Using unpkg
```
<script src="https://unpkg.com/coords-timezone"></script>
```

## Example Usage
```
const latitude = 30.0444;
const longitude = 31.2357;
const formatOffset = 'hh:mm';

const info = timezoneCalculator.getTimezoneInfo(latitude, longitude, formatOffset);
console.log(`Timezone: ${info.timezone}, Current Offset: ${info.currentOffset}, Standard Offset: ${info.standardOffset}, DST: ${info.dst}, Abbreviation: ${info.abbreviation}, Local Time: ${info.current}`);

```
### Offset Formats  
Here are the available offset formats:
| Format | Example  |
|--------|----------|
| hh:mm  |  +02:00  |
| hh     |  +02     |
| h      |  +2      |

## License
This project is licensed under the ISC License.
