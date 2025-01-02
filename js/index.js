"use strict";
const userLocationInput = document.querySelector("#userLocationInput");
const addLocationBtn = document.querySelector("#addLocationBtn");
const todayInfo = document.querySelectorAll(".todayInfo"); // contain 9 elements for today info
const tomorrowInfo = document.querySelectorAll(".tomorrowInfo"); // contain 5 elements for tomorrow Info
const thirdDayInfo = document.querySelectorAll(".thirdDayInfo"); // contain 5 elements for thirdday info
const baseURL = "https://api.weatherapi.com/v1/forecast.json?";
const APIkey = "aa3e51d0e1fa4977b0c202928243112";
let city = "cairo"; //defalut
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

userLocationInput.addEventListener("input", (e) => {
  if (userLocationInput.value) {
    city = e.currentTarget.value;
    getWeather();
  } else {
    getLocation();
  }
});

function getLocation() {
  const watchID = navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      //   console.log(latitude);
      //   console.log(longitude);
      city = `${latitude},${longitude}`;
      //   console.log(city);
      getWeather();
    },
    (error) => {
      console.log("user Location Not Founded");

      city = "cairo";
    },
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
  );
}

getLocation();
getWeather();

async function getWeather() {
  let res = await fetch(`${baseURL}key=${APIkey}&q=${city}&days=3`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (res.ok) {
    const { location, current, forecast } = await res.json();
    // console.log("current", current);
    // console.log("forecast", forecast.forecastday);
    // console.log(location.name,);
    displayCurrentWeather(location.name, current);
    displayNextDayesWeather(forecast.forecastday);
  } else {
    console.log("API Location Not Founded");
  }
}

function displayCurrentWeather(city, current) {
  const currentDay = new Date(current.last_updated);
  todayInfo[0].innerHTML = days[currentDay.getDay()]; // day
  todayInfo[1].innerHTML = `${currentDay.getDate()} ${
    // date of day
    months[currentDay.getMonth()]
  }`;
  todayInfo[2].innerHTML = city;
  todayInfo[3].innerHTML = `${current.temp_c}°C`;
  todayInfo[4].setAttribute("src", current.condition.icon);
  todayInfo[5].innerHTML = current.condition.text;
  todayInfo[6].innerHTML = `${current.cloud}%`;
  todayInfo[7].innerHTML = `${current.wind_kph}km/h`;
  todayInfo[8].innerHTML = current.wind_dir;
}

function displayNextDayesWeather(forecastday) {
  let displayDay = tomorrowInfo;
  //   console.log(forecastday.length);

  for (let i = 1; i < forecastday.length; i++) {
    if (i == 2) {
      displayDay = thirdDayInfo;
    }
    displayDay[0].innerHTML = days[new Date(forecastday[i].date).getDay()];
    displayDay[1].setAttribute("src", forecastday[i].day.condition.icon);
    displayDay[2].innerHTML = `${forecastday[i].day.maxtemp_c}°C`;
    displayDay[3].innerHTML = `${forecastday[i].day.mintemp_c}°C`;
    displayDay[4].innerHTML = forecastday[i].day.condition.text;
  }
}
