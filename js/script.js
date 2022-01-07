async function requestWeather(location) {
    const API_KEY = '4e955b4f015e6e1c3abe0c6a45555f95';
    try {
        const units = 'imperial';
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${units}`);
        if (!response.ok) {
            throw new Error("Location not found, please try again.");
        }
        const data = await response.json();
        return {name: location, units, data };
    } catch (err) {
        console.error(err.message);
    }
}

async function processWeatherData(data) {
    data = await data;
    if (!data) return;

    const weatherObject = {
        name: data.name,
        temperature: data.data.main,
        weather: data.data.weather,
        units: data.units
    };

    displayWeatherData(weatherObject);
}

function displayWeatherData(object) {
    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.innerHTML = '';

    const weatherDisplay = document.createElement('div');
    weatherDisplay.textContent = formatLocationName(object.name);
    weatherDisplay.classList.add('location');
    weatherContainer.appendChild(weatherDisplay);

    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = `http://openweathermap.org/img/wn/${object.weather[0].icon}@2x.png`;
    icon.alt = object.weather[0].description;
    icon.title = `${object.weather[0].main}/${object.weather[0].description}`;
    weatherDisplay.appendChild(icon);

    const temperatureContainer = document.createElement('div');
    temperatureContainer.classList.add('temperature-container');

    const temperatureDisplay = document.createElement('div');
    temperatureDisplay.textContent = object.temperature.temp;
    temperatureDisplay.classList.add('temperature');
    temperatureDisplay.classList.add(object.units);
    temperatureContainer.appendChild(temperatureDisplay);

    const feelsLikeDisplay = document.createElement('div');
    feelsLikeDisplay.textContent = object.temperature.feels_like;
    feelsLikeDisplay.classList.add('feels_like');
    feelsLikeDisplay.classList.add(object.units);
    temperatureContainer.appendChild(feelsLikeDisplay);
    weatherContainer.appendChild(temperatureContainer);

    const low = document.createElement('div');
    low.textContent = object.temperature.temp_min;
    low.classList.add(object.units);
    low.classList.add('low');
    weatherContainer.appendChild(low);

    const high = document.createElement('div');
    high.textContent = object.temperature.temp_max;
    high.classList.add(object.units);
    high.classList.add('high');
    weatherContainer.appendChild(high);

    const humidityDisplay = document.createElement('div');
    humidityDisplay.textContent = `Humidity: ${object.temperature.humidity}%`;
    weatherContainer.appendChild(humidityDisplay);

    const convertButton = document.createElement('button');
    convertButton.textContent = 'Convert to Celsius';
    convertButton.addEventListener('click', function() {
        if (convertButton.textContent.includes('Celsius')) {
            convertButton.textContent = 'Convert to Fahrenheit';
            
            convertTemperature(temperatureDisplay, convertToCelsius);
            convertTemperature(feelsLikeDisplay, convertToCelsius);
            convertTemperature(low, convertToCelsius);
            convertTemperature(high, convertToCelsius);

        } else {
            convertButton.textContent = 'Convert to Celsius';

            convertTemperature(temperatureDisplay, convertToFahrenheit);
            convertTemperature(feelsLikeDisplay, convertToFahrenheit);
            convertTemperature(low, convertToFahrenheit);
            convertTemperature(high, convertToFahrenheit);
        }
    })

    weatherContainer.appendChild(convertButton);

}

function convertTemperature(element, conversion) {
    element.textContent = conversion(element.textContent);
    if (element.classList.contains('imperial')) {
        element.classList.remove('imperial');
        element.classList.add('metric');
    } else {
        element.classList.remove('metric');
        element.classList.add("imperial");
    }
}

function convertToCelsius(temp) {
    if (!temp) return 1;

    return +((temp - 32) * 5/9).toFixed(2);
}

function convertToFahrenheit(temp) {
    if (!temp) return 1;

    return +(temp * 9/5 + 32).toFixed(2);
}

function formatLocationName(location) {
    let parts = location.split(',');

    parts = parts.map(function(part) {
        return part.slice(0,1).toUpperCase() + part.slice(1).toLowerCase();
    });
    
    return parts.join(", ");
}

const button = document.querySelector('button');
button.addEventListener('click', () => {
    if (!city.value) return;

    processWeatherData(requestWeather(city.value));
    city.value = '';
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
})

const city = document.querySelector('input');
city.addEventListener('keydown', (e) => {
    if (e.key !== "Enter") return;
    if (!city.value) return;

    processWeatherData(requestWeather(city.value));
    city.value = '';
});

processWeatherData(requestWeather('Brooklyn,NY,US'));