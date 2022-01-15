const API_KEY = "26f3723aadc42cdb29582dc1f7374be9";

const input = document.querySelector(".search-box__input");
const city = document.querySelector("#city-name");
const humidity = document.querySelector("#humidity");
const temp = document.querySelector("#temp");
const wind = document.querySelector("#wind");
const description = document.querySelector("#description");
const img = document.querySelector(".weather-icon");
const city_time = document.querySelector("#time");
const body = document.querySelector("body");
const languageInput = document.querySelector("#language");

const stringHolder = {
  vi: {
    err: "Không tìm thấy thành phố",
    humidity: "Độ ẩm",
    temperature: "Nhiệt độ",
    wind: "Gió",
    "current-time": "Thời gian",
    search: "Nhập tên thành phố",
  },
  us: {
    err: "City not found",
    humidity: "Humidity",
    temperature: "Temperature",
    wind: "Wind",
    "current-time": "Current time",
    search: "Search by city",
  },
  fr: {
    err: "La ville introuvable",
    humidity: "Humidité",
    temperature: "Température",
    wind: "Vent",
    "current-time": "Heure actuelle",
    search: "Recherche par ville",
  },
};

const run = (language = "vi") => {
  reset();
  input.placeholder = stringHolder[language]["search"];

  input.onsearch = (e) => {
    if (e.target.value !== "") {
      getData(e.target.value, API_KEY, language);
    }
  };

  languageInput.onchange = (e) => {
    run(e.target.value);
  };
};

const getData = (value, api_key, language) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${api_key}&units=metric&lang=${language}`
  ).then(async (response) => {
    const data = await response.json();
    if (data.message === "city not found") {
      alert(stringHolder[language]["err"]);
    } else {
      city.innerHTML = data.name;
      humidity.innerHTML = `${stringHolder[language]["humidity"]}: ${data.main.humidity}%`;
      let temperature = Math.round((data.main.temp + Number.EPSILON) * 10) / 10;
      temp.innerHTML = `${stringHolder[language]["temperature"]}: ${temperature}°C`;
      let windSpeed =
        Math.round((data.wind.speed * 3.6 + Number.EPSILON) * 100) / 100;
      wind.innerHTML = `${stringHolder[language]["wind"]}: ${windSpeed}km/h`;
      description.innerHTML = data.weather[0].description;
      img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      const { hours, minutes, seconds } = format_time(data);
      city_time.innerHTML = `${stringHolder[language]["current-time"]}: ${hours}:${minutes}:${seconds}`;
    }
  });
};

const format_time = (data) => {
  let d = new Date();
  let utc_offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() + utc_offset);
  let city_offset = data.timezone / 60;
  d.setMinutes(d.getMinutes() + city_offset);
  let hours = d.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = d.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = d.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  return { hours, minutes, seconds };
};

const updateLayout = () => {
  if (window.innerWidth > window.innerHeight && window.innerHeight < 813) {
    body.classList.remove("height-plus-160");
  } else if (
    window.innerWidth < window.innerHeight &&
    window.innerHeight < 813
  ) {
    body.classList.add("height-plus-160");
  }
};

const reset = () => {
  input.value = "";
  city.innerHTML = "";
  humidity.innerHTML = "";
  temp.innerHTML = "";
  wind.innerHTML = "";
  description.innerHTML = "";
  img.src = "";
  city_time.innerHTML = "";
};

window.addEventListener("orientationchange", updateLayout, false);

run();
