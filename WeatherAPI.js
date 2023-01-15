const HEADERS = {"User-Agent": "BasicWeatherApp hammy275@gmail.com"}

async function toGrid(lat, lon) {
    try {
        const response = await fetch("https://api.weather.gov/points/" + lat + "," + lon, {headers: HEADERS});
        const data = await response.json();
        return [data.properties.cwa, data.properties.gridX, data.properties.gridY];
    } catch (e) {
        return null;
    }
}

/*
Example period entry:
{
                "number": 1,
                "name": "Today",
                "startTime": "2023-01-14T08:00:00-08:00",
                "endTime": "2023-01-14T18:00:00-08:00",
                "isDaytime": true,
                "temperature": 58,
                "temperatureUnit": "F",
                "temperatureTrend": "falling",
                "windSpeed": "7 to 13 mph",
                "windDirection": "SSW",
                "icon": "https://api.weather.gov/icons/land/day/tsra,100/tsra,90?size=medium",
                "shortForecast": "Showers And Thunderstorms",
                "detailedForecast": "Rain before 10am, then showers and thunderstorms. Cloudy. High near 58, with temperatures falling to around 53 in the afternoon. South southwest wind 7 to 13 mph, with gusts as high as 30 mph. Chance of precipitation is 100%. New rainfall amounts between a half and three quarters of an inch possible."
            },
 */
async function getForecast(office, gridX, gridY) {
    try {
        const response = await fetch("https://api.weather.gov/gridpoints/" + office + "/" + gridX + "," + gridY + "/forecast", {headers: HEADERS});
        const data = await response.json();
        return data.properties.periods;
    } catch (e) {
        return null;
    }

}

export {toGrid, getForecast};