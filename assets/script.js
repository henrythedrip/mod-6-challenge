// example weather api url
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// 55c06a5306f77f20b1fd135618cf25af

// example geocoding api link
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// TODO: this shouldnt be done, but we have no backend so we must put it here
const API_KEY = '55c06a5306f77f20b1fd135618cf25af'

// get elemements on page
const currentWeatherContainer = document.getElementById('display-container');
const fiveDayforecastContainer = document.getElementById('five-day-forecast-container');
const searchHistory = document.getElementById('search-history');
const searchButton = document.getElementById('search-submit');
const clearLocalStorageButton = document.getElementById('clear-local-storage');

// handle searching for a location
// searchButton.addEventListener('click', latitudeAndLongitude)
searchButton.addEventListener('click', makeWeatherWork)
clearLocalStorageButton.addEventListener('click', () => {
  localStorage.clear();
})

// handle reading the history on initial page load
function paintSearchHistory() {
  // clear out the container
  while (searchHistory.firstChild) {
    searchHistory.removeChild(searchHistory.lastChild)
  }

  // iterate over items in localstorage
  Object.values(localStorage).forEach(item => {
    // item starts out as string from localstorage
    item = JSON.parse(item);
    let newLocation = document.createElement('div');
    newLocation.setAttribute('class', 'location-in-history')
    let cityNameEl = document.createElement('p')
    cityNameEl.textContent = item.name
    newLocation.appendChild(cityNameEl)
    
    // add event listener to history item
    newLocation.addEventListener('click', async event => {
      const weatherData = await getCurrentWeather(item.coord);
      paintCurrentWeather(weatherData);
      
      const fiveDay = await getFiveDayWeather(item.coord);
      paintFiveDayWeather(fiveDay);
    })
    
    // add location to search history container
    searchHistory.appendChild(newLocation)
  })
}

// call on initial page load to populate history
paintSearchHistory();

// get the lat/long for a location based on its name
async function getLatitudeAndLongitude() {
  // https://openweathermap.org/api/geocoding-api

  const cityValue = document.getElementById('city-search-box').value;

  const url = 'https://api.openweathermap.org/geo/1.0/direct?' +
    `q=${cityValue}` +  // need to pass city name
    '&limit=1' +        // we only want one result
    `&appid=${API_KEY}` // need to pass api key

  const locationResponse = await fetch(url);
  const locationJSON = await locationResponse.json()

  // handle zero locations found/bad search
  if (locationJSON.length == 0) {
    alert('Find a real place friend!')
    return null;
  }

  // location is an object {}
  return locationJSON[0];
}

// get current weather data for a location
async function getCurrentWeather(location) {
  // https://openweathermap.org/current

  // get weather data
  const url = 'https://api.openweathermap.org/data/2.5/weather' +
    `?lat=${location.lat}` +     // need to provide location
    `&lon=${location.lon}` +     // need to provide location
    `&appid=${API_KEY}`          // need to provide api key

  const weatherResponse = await fetch(url);
  const weatherJson = await weatherResponse.json();
  return weatherJson;
}

// get the five day forecast
async function getFiveDayWeather(location) {
  // https://openweathermap.org/forecast5

  // get weather data
  const url = 'https://api.openweathermap.org/data/2.5/forecast' +
    '?units=imperial' +          // need to make units ferinheight
    `&lat=${location.lat}` +     // need to provide location
    `&lon=${location.lon}` +     // need to provide location
    `&appid=${API_KEY}`          // need to provide api key

  const weatherResponse = await fetch(url);
  const weatherJson = await weatherResponse.json();

  // allows only indecies at noon to be pushed into a new array and returns it
  let dayArray = [];
  for (let i = 4; i < weatherJson.list.length; i += 8) {
    dayArray.push(weatherJson.list[i]);
  }
  return dayArray;
}

// paint each of the five weather forecasts
function paintFiveDayWeather(dayArray) {
  // clear out the container
  while (fiveDayforecastContainer.firstChild) {
    fiveDayforecastContainer.removeChild(fiveDayforecastContainer.lastChild)
  }

  dayArray.forEach(singleDay => {
    // console.log(singleDay);
    let todaysCard = document.createElement('div');
    todaysCard.setAttribute('class', 'five-day-card');

    //date
    let fiveDayDate = document.createElement('p');
    let date = new Date(singleDay.dt_txt)
    fiveDayDate.textContent = date.toDateString()
    todaysCard.appendChild(fiveDayDate)

    //icon
    let fiveDayIcon = document.createElement('img')
    fiveDayIcon.setAttribute('src', `https://openweathermap.org/img/wn/${singleDay.weather[0].icon}@2x.png`)
    todaysCard.appendChild(fiveDayIcon)

    //wind
    let fiveDayWind = document.createElement('p');
    fiveDayWind.textContent = `Wind speed: ${singleDay.wind.speed}`;
    todaysCard.appendChild(fiveDayWind)

    //temp
    let fiveDayTemp = document.createElement('p');
    fiveDayTemp.textContent = `Temperature: ${singleDay.main.temp} F`
    todaysCard.appendChild(fiveDayTemp)

    //humidity
    let fiveDayHumidity = document.createElement('p');
    fiveDayHumidity.textContent = `Humidity: ${singleDay.main.humidity}%`
    todaysCard.appendChild(fiveDayHumidity)

    //description
    let fiveDayDescription = document.createElement('p');
    fiveDayDescription.textContent = `Weather: ${singleDay.weather[0].description}`
    todaysCard.appendChild(fiveDayDescription)

    fiveDayforecastContainer.appendChild(todaysCard);
  })
}


function paintCurrentWeather(weatherObj) {
  // clear out the container
  while (currentWeatherContainer.firstChild) {
    currentWeatherContainer.removeChild(currentWeatherContainer.lastChild)
  }

  // name
  let currentLocationName = document.createElement('p');
  currentLocationName.textContent = weatherObj.name
  currentWeatherContainer.appendChild(currentLocationName)

  //date
  let currentDate = document.createElement('p')
  currentDate.textContent = `Date: ${new Date().toDateString()}`
  currentWeatherContainer.appendChild(currentDate)

  //icon
  let currentIcon = document.createElement('img')
  currentIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@2x.png`)
  currentWeatherContainer.appendChild(currentIcon)

  //wind
  let currentWindSpeed = document.createElement('p')
  currentWindSpeed.textContent = `Wind speed: ${weatherObj.wind.speed}`
  currentWeatherContainer.appendChild(currentWindSpeed);

  //temp
  let currentTemperature = document.createElement('p')
  // the api returns temperatures in Kelvin, convert to fahrenheit
  let fahr = ((weatherObj.main.temp - 273.15) * 1.8) + 32
  currentTemperature.textContent = `Temperature: ${fahr.toFixed(1)} F`
  currentWeatherContainer.appendChild(currentTemperature)

  //humidity
  let currentHumidity = document.createElement('p')
  currentHumidity.textContent = `Humidity: ${weatherObj.main.humidity}%`
  currentWeatherContainer.appendChild(currentHumidity)

  //description (snowy)
  let currentWeatherDescription = document.createElement('p')
  currentWeatherDescription.textContent = `Weather: ${weatherObj.weather[0].description}`
  currentWeatherContainer.appendChild(currentWeatherDescription)
}


async function makeWeatherWork() {

  const location = await getLatitudeAndLongitude()
  if (location === null) return;

  const weatherData = await getCurrentWeather(location);
  paintCurrentWeather(weatherData);

  const fiveDayWeatherData = await getFiveDayWeather(location);
  paintFiveDayWeather(fiveDayWeatherData);

  // we have a location, so lets add it to the history
  const temp = {
    name: location.name,
    coord: weatherData.coord,
    // timestamp so we can delete oldest history
    timestamp: Date.now()
  }

  // if its a new location, add to history and localstorage
  if (!Object.keys(localStorage).includes(String(weatherData.id))) {
    // add new location to localstorage and then repaint the history
    localStorage.setItem(String(weatherData.id), JSON.stringify(temp))
    paintSearchHistory();
  }
}
