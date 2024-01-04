console.log('Hello from script.js');

// example weather api url
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// 55c06a5306f77f20b1fd135618cf25af

// example geocoding api link
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}



// TODO: this shouldnt be done, but we have no backend so we must put it here
const API_KEY = '55c06a5306f77f20b1fd135618cf25af'


// search history should be saved in local storage, would be nice to save location data as well as names

// get elemements on page
const currentWeatherContainer = document.getElementById('display-container');
const searchHistory = document.getElementById('search-history');
const searchButton = document.getElementById('search-submit');

// handle searching for a location
searchButton.addEventListener('click', async event => {
    const cityValue = document.getElementById('city-search-box').value;
    // console.log(cityValue);

    const locationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${API_KEY}`);
    const locationJSON = await locationResponse.json()
    console.log(locationJSON);

    // handle zero locations found/bad search
    if (locationJSON.length == 0) {
        alert('Find a real place friend!')
    }

    // location is an object {}
    const location = locationJSON[0];
    const lat = location.lat;
    const lon = location.lon;
    console.log(lat, lon);

    // get weather data
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    const weatherJson = await weatherResponse.json()
    console.log(weatherJson);

    // we have a location, so lets add it to the history
    const temp = {
      name: weatherJson.city.name,
      coord: weatherJson.city.coord,
      // timestamp so we can delete oldest history
      timestamp: Date.now()
    }
    
    // TODO: get rid of oldest history if there are too many
    // if (localStorage.length >= 10) {
    //   // sort all localstorage entries by timestamp
    //   // remove oldest one
    //   const sorted = Array(localStorage).sort((a, b) => {
    //     console.log(a);
    //     console.log(b);
    //     return a.timestamp - b.timestamp;
    //  });
    //  console.log(sorted);
    //  localStorage.removeItem(sorted[9]);
    // }

    localStorage.setItem(String(weatherJson.city.id), JSON.stringify(temp))

    // handle adding location to search history
    let newLocation = document.createElement('div');
    newLocation.setAttribute('class', 'location-in-history')
    let cityNameEl = document.createElement('p')
    cityNameEl.textContent = weatherJson.city.name
    newLocation.appendChild(cityNameEl)
    searchHistory.appendChild(newLocation)

})

// we probably want the weather object for the location to render as an argument
function renderWeatherData(weatherObject) {
  console.log('rendering weather data');

}

// TODO: create function to render localstorage history locations onto the screen for initial pageload and for when we change localstorage

// TODO: create function to draw current and 5 day forecast for a location on the screen, so we can do it when we search and when we click on something in the history
function drawWeather() {
  // // handle adding current weather to page
  // let current = document.createElement('div')
  // current.setAttribute('class', 'current-days-weather')
  // current.appendChild(cityNameEl)

  // console.log(weatherJson);
  
  // // date
  // let currentDate = document.createElement('p')
  
  // // icon
  // let currentIcon = document.createElement('p')
  
  // // temperature
  // let currentTemp = document.createElement('p')
  
  // // humidity
  // let currentHumidity = document.createElement('p')
  
  // // wind speed
  // let currentWindSpeed = document.createElement('p')
  
  // currentWeatherContainer.appendChild(current)
}