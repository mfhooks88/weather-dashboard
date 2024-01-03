document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "951126ae0bb7ec55597563c95e977311";
    const searchButton = document.querySelector("button");
    const searchHistoryElement = document.getElementById("search-history");

    // Function to add a city to the search history
    // help provided during tutoring session
    function addToSearchHistory(cityName) {
        const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

        // Check if the city is not already in the search history
        if (!searchHistory.includes(cityName)) {
            searchHistory.push(cityName);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

            const listItem = document.createElement("li");
            listItem.textContent = cityName;
            listItem.addEventListener("click", function () {
                fetchAndDisplayWeather(cityName);
            });
            searchHistoryElement.appendChild(listItem);
        }
    }


    // Function to update the search history UI
    function updateSearchHistoryUI(searchHistory) {
        searchHistoryElement.innerHTML = "";
        searchHistory.forEach(city => {
            addToSearchHistory(city);
        });
    }

    // Initial call to update search history UI when the page loads
    updateSearchHistoryUI(JSON.parse(localStorage.getItem("searchHistory")) || []);

    // Click event listener for the search button
    searchButton.addEventListener("click", function () {
        const cityName = document.getElementById("city-search").value;
        if (cityName) {
            fetchAndDisplayWeather(cityName);
        } else {
            alert("Please enter a city name");
        }
    });

    // Function to fetch and display weather data
    function fetchAndDisplayWeather(cityName) {
        // Fetch current weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                addToSearchHistory(cityName); // Add searched city to history
            })
            .catch(error => console.error("Error fetching current weather:", error));

        // Fetch 5-day forecast data
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayFiveDayForecast(data);
            })
            .catch(error => console.error("Error fetching 5-day Forecast:", error));
    }

    //show current data for the city just searched
    //help provided during tutoring session
    function displayCurrentWeather(data) {
        const currentCityElement = document.getElementById("current-city");
        const currentDateElement = document.getElementById("current-date");
        const currentTempElement = document.getElementById("current-temp");
        const currentDescriptionElement = document.getElementById("current-description");
        const windSpeedElement = document.getElementById("wind-speed");
        const humidityElement = document.getElementById("humidity");
        const currentWeatherIconElement = document.getElementById("current-weather-icon");


        const date = new Date(); // Use the current date and time
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


        const temperature = ((data.main.temp - 273.15) * 9 / 5) + 32;
        const description = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

        // Set the current city name
        currentCityElement.textContent = `Current City: ${data.name}`;

        currentDateElement.textContent = `Date: ${formattedDate}`;
        currentTempElement.textContent = `${temperature.toFixed(0)}°F`;
        currentDescriptionElement.textContent = description;
        windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;
        humidityElement.textContent = `Humidity: ${humidity}%`;
        currentWeatherIconElement.src = iconUrl;
    }

    // displays 5 day forecast for city just searched by user
    // help provided during tutoring session
    function displayFiveDayForecast(data) {
        const fiveDayForecastElement = document.getElementById("five-day-forecast");

        const forecastList = data.list;

        const dailyForecasts = {};

        // Get the current date
        const currentDate = new Date();

        forecastList.forEach(item => {
            // Extract the date from the forecast item
            const date = new Date(item.dt_txt);

            // Check if the date is within the next 5 days
            if (date.getDate() > currentDate.getDate() && date.getDate() <= currentDate.getDate() + 5) {
                // Check if it's the first forecast item for the day (12:00:00)
                if (!dailyForecasts[date.toDateString()]) {
                    dailyForecasts[date.toDateString()] = item;
                }
            }
        });

        fiveDayForecastElement.innerHTML = "";

        for (const date in dailyForecasts) {
            const forecastItem = document.createElement("div");
            const forecastDate = new Date(date);
            const formattedForecastDate = `${forecastDate.getFullYear()}-${(forecastDate.getMonth() + 1).toString().padStart(2, '0')}-${forecastDate.getDate().toString().padStart(2, '0')}`;

            const temperature = ((dailyForecasts[date].main.temp - 273.15) * 9 / 5) + 32;
            const iconCode = dailyForecasts[date].weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            const windSpeed = dailyForecasts[date].wind.speed;
            const humidity = dailyForecasts[date].main.humidity;

            forecastItem.innerHTML = `<p>Date: ${formattedForecastDate}</p>
                                     <p>Temperature: ${temperature.toFixed(0)}°F</p>
                                     <p>Wind Speed: ${windSpeed} m/s</p>
                                     <p>Humidity: ${humidity}%</p>
                                     <img src="${iconUrl}" alt="Weather Icon">`;

            fiveDayForecastElement.appendChild(forecastItem);
        }

    }

});
