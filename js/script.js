async function requestWeather(location) {
    const API_KEY = '4e955b4f015e6e1c3abe0c6a45555f95';
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function processWeatherData(data) {
    data = await data;
    const weatherObject = {
        temperature: data.main,
        weather: data.weather
    };

    console.log(weatherObject);
}

const button = document.querySelector('button');
button.addEventListener('click', () => {
    const city = document.querySelector('input');

    processWeatherData(requestWeather(city.value));
    city.value = '';
});