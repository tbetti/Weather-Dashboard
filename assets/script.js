var formEl = document.querySelector("#weather-form");
var cityEl = document.querySelector("#city");
var apiKey = "0773ca9aaf5c56e841a981221d072a10";
var city = ""; // this will be from user input
var lat;
var lon;

var formSubmit = function(event){
    event.preventDefault();
    
    city = splitString(cityEl.value);
    console.log(city);
    
    getLatLon();
    //getWeather();
}

// Get latitude and longitude of city
function getLatLon(){
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            lat = data.coord.lat;
            lon = data.coord.lon;
            
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            console.log(forecastUrl);
        });
}

// Take any city name that has multiple words and join each word with a "+".
// Example: New York City => New+York+City
function splitString(string){
    string = string.split(" ");
    string = string.join("+");
    return string;
}

formEl.addEventListener("submit", formSubmit);