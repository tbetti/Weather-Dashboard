const apiKey = "0773ca9aaf5c56e841a981221d072a10";

// Set up variables to access DOM
var formEl = document.querySelector("#weather-form");
var cityEl = document.querySelector("#city");
var resultsSectionEl = document.querySelector("article");
var cardContainer = document.createElement("div");
cardContainer.setAttribute("class", "card-container"); 
var fiveDayHeading = document.createElement("h2");
fiveDayHeading.textContent = "5-Day Forecast";                       

// Other global variables
var weatherAttribute = ["Temperature: ", "Wind: ", "Humidity: ", "UV Index: "];
var city = "";

// When submit button pressed, get latitude and longitude of city
var formSubmit = function(event){
    event.preventDefault();
    
    city = splitString(cityEl.value);
    getLatLon();
}

// Take any city name that has multiple words and join each word with a "+".
// Example: New York City => New+York+City
function splitString(string){
    string = string.split(" ");
    string = string.join("+");
    return string;
}

// Get latitude and longitude of city
function getLatLon(){
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
            getWeather(forecastUrl);
        })
}

// Get weather for given latitude and longitude
function getWeather(url){
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            //Current Conditions
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvIndex = data.current.uvi;
            var date = getDate(data.current.dt);

            var currentDataValues = [temp.toFixed(0) + "°F", wind + " MPH", humidity + "%", uvIndex];
            createCurrentCard(date, currentDataValues);

            //Forecasted Conditions
            resultsSectionEl.appendChild(fiveDayHeading);
            resultsSectionEl.appendChild(cardContainer);
            
            for(var i=1; i<=5; i++){
                date = getDate(data.daily[i].dt);
                temp = data.daily[i].temp.day;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;
                var forecastedValues = [temp.toFixed(0) + "°F", wind + " MPH", humidity + "%"];

                createForecast(date, forecastedValues);
                forecastedValues = [];
            }
        })
}

// Read in unix date and return standard date
function getDate(unix){
    var timeStamp = unix * 1000; // Give timestamp in milliseconds
    var date = new Date(timeStamp);
    var weekdayShort = date.toLocaleString("en-US", {weekday: "short"});
    var weekdayLong = date.toLocaleString("en-US", {weekday: "long"});
    var month = date.toLocaleString("en-US", {month: "numeric"});
    var day = date.toLocaleString("en-US", {day: "numeric"});

    var dateArray = [weekdayShort, weekdayLong, month, day];
    return dateArray;
}

// Create card to display current weather information
function createCurrentCard(date, dataValues){
    var currentCard = document.createElement("div")
    currentCard.setAttribute("class", "current-card");
    
    var displayCity = document.createElement("h2");
    displayCity.textContent = date[1] + ", " + date[2] + "/" + date[3];

    currentCard.appendChild(displayCity);

    for(var i=0; i<4; i++){
        var listItem = document.createElement("p");
        listItem.textContent = weatherAttribute[i] + dataValues[i];
        currentCard.appendChild(listItem);
    }
    resultsSectionEl.appendChild(currentCard);
}

// Create forecast cards
function createForecast(date, dataValues){
    var dailyCard = document.createElement("div");
    dailyCard.setAttribute("class", "daily-card");

    var heading3 = document.createElement("h3");
    heading3.setAttribute("class", "subheading");
    heading3.textContent = date[0];

    var heading4 = document.createElement("h4");
    heading4.setAttribute("class", "subheading");
    heading4.textContent = date[2] + "/" + date[3];

    dailyCard.appendChild(heading3);
    dailyCard.appendChild(heading4);

    // print daily forecast
    for (var i = 0; i < 3; i++) {
        var listItem = document.createElement("p");
        listItem.textContent = weatherAttribute[i] + dataValues[i];
        dailyCard.appendChild(listItem);
    }
    cardContainer.appendChild(dailyCard);
}

formEl.addEventListener("submit", formSubmit);