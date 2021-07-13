var apiKey = "0773ca9aaf5c56e841a981221d072a10";
var formEl = document.querySelector("#weather-form");
var cityEl = document.querySelector("#city");
var city = "";

var formSubmit = function(event){
    event.preventDefault();
    
    city = splitString(cityEl.value);
    console.log(city);
    
    getLatLon();
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
            console.log(forecastUrl);

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
            
            console.log(date);
            console.log("Temperature: " + temp);
            console.log("Windspeed: " + wind);
            console.log("Humidity: " + humidity);
            console.log("UV Index: " + uvIndex);
        })
}

function getDate(unix){
    var timeStamp = unix * 1000; // Give timestamp in milliseconds
    var date = new Date(timeStamp);
    var weekday = date.toLocaleString("en-US", {weekday: "short"});
    var month = date.toLocaleString("en-US", {month: "numeric"});
    var day = date.toLocaleString("en-US", {day: "numeric"});

    return weekday + ", " + month + "/" + day;
}

// Take any city name that has multiple words and join each word with a "+".
// Example: New York City => New+York+City
function splitString(string){
    string = string.split(" ");
    string = string.join("+");
    return string;
}

formEl.addEventListener("submit", formSubmit);