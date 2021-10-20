var searchBtn = $("#search-btn");
var flightNum = $("#flight-search");
var city = $("#city-search");

function getFlightMap(event){
    event.preventDefault()
    console.log(flightNum.val());
    var requestUrl = "http://flightxml.flightaware.com/json/FlightXML2/MapFlight?ident=" + flightNum.val()

    $.ajax({
    url: requestUrl,
    method: "GET",
    dataType: "jsonp",
    jsonp: "jsonp_callback",
    }).then(function (response){
        console.log(response);
        var image = $("#image");
        image.attr("src", "data:image/png;base64," + response.MapFlightResult);
    })
}

function getForecast(event){
    event.preventDefault();
    console.log(city.val());
}


searchBtn.on("click", getFlightMap);
searchBtn.on("click", getForecast);

$(document).ready(function () {

    // OpenWeather API
    const apiKey = '5c59181ea9bfefcb5650eade86d893bd';

    // Selectors for HTML elements to display weather information
    const cityEl = $('h2#city');
    const dateEl = $('h3#date');
    const weatherIconEl = $('img#weather-icon');
    const temperatureEl = $('span#temperature');
    const humidityEl = $('span#humidity');
    const windEl = $('span#wind');
    const cityListEl = $('div.cityList');
    // Selectors for form elements
    const cityInput = $('#city-input');
    const stateInput = $('#state-input');
    const countryInput = $('#country-input');


    // Helper function to sort cities from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const cityA = a.city.toUpperCase();
        const cityB = b.city.toUpperCase();

        let comparison = 0;
        if (cityA > cityB) {
            comparison = 1;
        } else if (cityA < cityB) {
            comparison = -1;
        }
        return comparison;
    }

    // functions to build the URL for the OpenWeather API call

    function buildURLFromInputs(city, state, country) {
        if (city && state && country) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}`;
        } else if (city && country) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
        } else {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        }
    }

    function buildURLFromId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    // search for weather conditions by calling the OpenWeather API
    function searchWeather(queryURL) {

        // Create an AJAX call to retrieve weather data
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            // Store current city in past cities
            let city = response.name;
            let id = response.id;
            // remove duplicate cities
            if (pastCities[0]) {
                pastCities = $.grep(pastCities, function (storedCity) {
                    return id !== storedCity.id;
                })
            }
            pastCities.unshift({ city, id });
            storeCities();
            displayCities(pastCities);

            // display current weather in DOM elements
            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

            // Call OpenWeather API OneCall with lat and lon to get the UV index and 5 day forecast
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            $.ajax({
                url: queryURLAll,
                method: 'GET'
            }).then(function (response) {
                let uvIndex = response.current.uvi;
                let uvColor = setUVIndexColor(uvIndex);
                uvIndexEl.text(response.current.uvi);
                uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
                let fiveDay = response.daily;

                // display 5 day forecast in DOM elements
                for (let i = 0; i <= 5; i++) {
                    let currDay = fiveDay[i];
                    $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
                    $(`div.day-${i} .fiveDay-img`).attr(
                        'src',
                        `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                    ).attr('alt', currDay.weather[0].description);
                    $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                    $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
                }
            });
        });
    }


    // function to display the last city searched on page load
    function displayLastSearchedCity() {
        if (pastCities[0]) {
            let queryURL = buildURLFromId(pastCities[0].id);
            searchWeather(queryURL);
        } else {
            // if no past searched cities, load Columbus, OH weather data
            let queryURL = buildURLFromInputs("Columbus", "OH", "US");
            searchWeather(queryURL);
        }
    }

        // Retrieving and scrubbing the city, state, and/or country from the inputs
        let city = cityInput.val().trim();
        city = city.replace(' ', '%20');

        let state = stateInput.val().trim();

        let country = countryInput.val().trim();

        // clear the input fields
        cityInput.val('');
        stateInput.val('');
        countryInput.val('');

        // Build the query url with the city, state, and country and searchWeather
        if (city) {
            let queryURL = buildURLFromInputs(city, state, country);
            searchWeather(queryURL);
        }
    });

    // Click handler for city buttons to load that city's weather
    $(document).on("click", "button.city-btn", function (event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(pastCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildURLFromId(foundCity[0].id)
        searchWeather(queryURL);
    });
