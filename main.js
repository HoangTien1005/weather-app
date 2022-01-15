const API_KEY = "26f3723aadc42cdb29582dc1f7374be9";

const input = document.querySelector("input");
const city = document.querySelector("#city-name");
const humidity = document.querySelector("#humidity");
const temp = document.querySelector("#temp");
const wind = document.querySelector("#wind");
const description = document.querySelector("#description");
const img = document.querySelector(".weather-icon");
const city_time = document.querySelector("#time");

const body = document.querySelector('body');


window.addEventListener("orientationchange", updateLayout, false);

input.addEventListener("change", (e) => {
  getData(e.target.value, API_KEY);
});

function getData(value, api_key) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${api_key}&units=metric&lang=vi`
  ).then(async (response) => {
    const data = await response.json();
    if (data.message === "city not found") {
      alert("Không tìm thấy thành phố");
    } else {
      console.log(data);
      city.innerHTML = data.name;
      humidity.innerHTML = `Độ ẩm: ${data.main.humidity}%`;
      let temperature =
        Math.round((data.main.temp + Number.EPSILON) * 10) / 10;
      temp.innerHTML = `Nhiệt độ: ${temperature}°C`;
      let windSpeed =
        Math.round((data.wind.speed * 3.6 + Number.EPSILON) * 100) / 100;
      wind.innerHTML = `Gió: ${windSpeed}km/h`;
      description.innerHTML = data.weather[0].description;
      img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


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
      city_time.innerHTML = `Thời gian: ${hours}:${minutes}:${seconds}`;
    }
  });
}


function updateLayout() {
  if(window.innerWidth > window.innerHeight && window.innerHeight < 813) {
    body.classList.remove("height-plus-160");
  }
  else if(window.innerWidth < window.innerHeight && window.innerHeight < 813){
    body.classList.add("height-plus-160");
  }
}