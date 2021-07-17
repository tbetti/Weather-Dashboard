const API_KEY = "0773ca9aaf5c56e841a981221d072a10";

// Set up variables to access DOM
var formEl = document.querySelector("#weather-form");
var cityEl = document.querySelector("#city");
var searchSection = document.querySelector(".search-section");
var buttonSection = document.querySelector(".button-container")
var resultsSectionEl = document.querySelector(".results-section");
buttonSection.addEventListener("click", clickButton);

// Other global variables
var weatherAttribute = ["Temperature: ", "Wind: ", "Humidity: ", "UV Index: "];
var cityName;
var cityArr = JSON.parse(localStorage.getItem("cityArr")) || [];

// Create buttons when webpage reloads
for (var i=0; i<cityArr.length; i++){
    createButton(i);
}

// When submit button pressed, get latitude and longitude of city
var formSubmit = function (event) {
    event.preventDefault();
    resultsSectionEl.innerHTML = "";
    
    splitString(cityEl.value);
    if(cityArr.indexOf(cityName)===-1){
        cityArr.push(cityName);
    };
    
    localStorage.setItem("cityArr", JSON.stringify(cityArr));
    buttonSection.innerHTML = "";
    
    for(var i=0; i < cityArr.length; i++){
        createButton(i);
    }
    //createButton();
    getLatLon();
    cityEl.value = "";
}

// Take any city name that has multiple words, change first letter to upper case
// Example: new york city --> New York City
function splitString(string) {
    string = string.split(" ");
    for (var i = 0; i < string.length; i++){
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    cityName = string.join(" ");
}

// Create button to access previous search and connect it to a function
function createButton(index) {
    var newBtn = document.createElement("button");
    newBtn.setAttribute("id", "city-btn");
    newBtn.setAttribute("class", "btn search city");
    newBtn.setAttribute("data-name", cityArr[index]);
    newBtn.textContent = cityArr[index];
    buttonSection.appendChild(newBtn);
}

function clickButton(event) {
    console.log("click");
    var button = event.target;
    cityName = button.getAttribute("data-name");
    resultsSectionEl.innerHTML = "";
    cityEl.value = "";

    getLatLon();
}

// Get latitude and longitude of city
function getLatLon() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY;

    fetch(requestUrl)
        .then(function (response) {
            console.log(response.status !== 200);
            if (response.status !== 200){
                alert("City name not vaild!");
                return;
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            //Use lat and lon coordinates to get weather
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + API_KEY;
            getWeather(forecastUrl);
        })
        // .catch(function (err) {
        //     alert("City name not vaild!");
        //     return err;
        // })
}

// Get weather for given latitude and longitude
function getWeather(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            //Current Conditions
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvIndex = data.current.uvi;
            var date = getDate(data.current.dt);
            var iconUrl = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"

            var currentDataValues = [iconUrl, temp.toFixed(0) + "°F", wind + " MPH", humidity + "%", uvIndex];
            createCurrentCard(date, currentDataValues);

            //Forecasted Conditions
            var fiveDayHeading = document.createElement("h2");
            fiveDayHeading.textContent = "5-Day Forecast";

            var cardContainer = document.createElement("div");
            cardContainer.setAttribute("class", "card-container");
            resultsSectionEl.appendChild(fiveDayHeading);
            resultsSectionEl.appendChild(cardContainer);

            for (var i = 1; i <= 5; i++) {
                date = getDate(data.daily[i].dt);
                temp = data.daily[i].temp.day;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;
                iconUrl = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png"
                var forecastedValues = [iconUrl, temp.toFixed(0) + "°F", wind + " MPH", humidity + "%"];

                createForecast(cardContainer, date, forecastedValues);
                forecastedValues = [];
            }
        })
}

// Read in unix date and return standard date
function getDate(unix) {
    var timeStamp = unix * 1000;
    var date = new Date(timeStamp);

    var dateObj = {
        shortWeekday: date.toLocaleString("en-US", { weekday: "short" }), 
        longWeekday: date.toLocaleString("en-US", { weekday: "long" }), 
        month: date.toLocaleString("en-US", { month: "numeric" }), 
        day: date.toLocaleString("en-US", { day: "numeric" })
    };
    return dateObj;
}

// Create card to display current weather information
function createCurrentCard(date, dataValues) {
    var currentCard = document.createElement("div")
    currentCard.setAttribute("class", "current-card");

    var displayCity = document.createElement("h2");
    displayCity.textContent = cityName + " (" + date.longWeekday + ", " + date.month + "/" + date.day + ")";

    var displayIcon = document.createElement("img");
    displayIcon.setAttribute("src", dataValues[0]);

    currentCard.appendChild(displayCity);
    currentCard.appendChild(displayIcon);

    for (var i = 1; i < dataValues.length; i++) {
        var listItem = document.createElement("p");
        listItem.textContent = weatherAttribute[i - 1] + dataValues[i];
        currentCard.appendChild(listItem);
    }
    resultsSectionEl.appendChild(currentCard);
}

// Create forecast cards
function createForecast(cardContainer, date, dataValues) {
    var dailyCard = document.createElement("div");
    dailyCard.setAttribute("class", "daily-card");

    var heading3 = document.createElement("h3");
    heading3.setAttribute("class", "subheading");
    heading3.textContent = date.shortWeekday;

    var heading4 = document.createElement("h4");
    heading4.setAttribute("class", "subheading");
    heading4.textContent = date.month + "/" + date.day;

    var displayIcon = document.createElement("img");
    displayIcon.setAttribute("src", dataValues[0])

    dailyCard.appendChild(heading3);
    dailyCard.appendChild(heading4);
    dailyCard.appendChild(displayIcon);

    // print daily forecast
    for (var i = 1; i < dataValues.length; i++) {
        var listItem = document.createElement("p");
        listItem.textContent = weatherAttribute[i - 1] + dataValues[i];
        dailyCard.appendChild(listItem);
    }
    cardContainer.appendChild(dailyCard);
}

formEl.addEventListener("submit", formSubmit);