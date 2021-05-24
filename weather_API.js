const API_KEY = "26f3723aadc42cdb29582dc1f7374be9";

var input = document.querySelector("input");
var city = document.querySelector("#city-name");
var humidity = document.querySelector("#humidity");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var description = document.querySelector("#description");
var img = document.querySelector(".weather-icon");
var city_time = document.querySelector("#time");

input.addEventListener("change", (e) => {
  getData(e.target.value, API_KEY);
});

function getData(value, api_key) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${api_key}&lang=vi`
  ).then(async (response) => {
    const data = await response.json();
    if (data.message === "city not found") {
      alert("Không tìm thấy thành phố");
    } else {
      console.log(data);
      city.innerHTML = data.name;
      humidity.innerHTML = `Độ ẩm: ${data.main.humidity}%`;
      let temperature =
        Math.round((data.main.temp - 273.15 + Number.EPSILON) * 10) / 10;
      temp.innerHTML = `${temperature}°C`;
      let windSpeed =
        Math.round((data.wind.speed * 3.6 + Number.EPSILON) * 100) / 100;
      wind.innerHTML = `Gió: ${windSpeed}km/h`;
      description.innerHTML = data.weather[0].description;
      img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


      var d = new Date();
      var utc_offset = d.getTimezoneOffset();
      d.setMinutes(d.getMinutes() + utc_offset);
      var city_offset = data.timezone / 60;
      d.setMinutes(d.getMinutes() + city_offset);
      var hours = d.getHours();
      var minutes = d.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      var seconds = d.getSeconds();
      if (seconds < 10) seconds = "0" + seconds;
      city_time.innerHTML = `${hours}:${minutes}:${seconds}`;
    }
  });
}
