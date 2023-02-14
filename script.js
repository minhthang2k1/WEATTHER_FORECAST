const todayforecast = document.querySelector(".hour-forecast");
const windrain = document.querySelector(".wind-rain");
const temprain = document.querySelector(".rain-temp");
const suntoday = document.querySelector(".sun-today");
const dayforecast = document.querySelector(".day-forecast");
const button = document.querySelector(".btn-type");
const btnSearch = document.querySelector(".btn-search");
const valueInput = document.querySelector("input");

// API
let myAPI =
  "http://api.weatherapi.com/v1/forecast.json?key=899f6a71bc1f49a4a1431149230802&q=vietnam&days=8&aqi=yes&alerts=no";

// HANDLE BUTTON SEARCH COUNTRY
function handleSearch() {
  const value = valueInput.value;
  if (value) {
    myAPI = `http://api.weatherapi.com/v1/forecast.json?key=899f6a71bc1f49a4a1431149230802&q=${value.toUpperCase()}&days=8&aqi=yes&alerts=no`;
    valueInput.value = "";
  } else {
    valueInput.value = "";
  }
  return myAPI;
  // return (myAPI = `http://api.weatherapi.com/v1/forecast.json?key=899f6a71bc1f49a4a1431149230802&q=${value.toLowerCase()}&days=9&aqi=yes&alerts=no`);
}

// CLICK BUTTON SEARCH
btnSearch.addEventListener("click", callAPI);

// KEYPRESS ENTER INPUT
valueInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    callAPI();
    return (valueInput.value = "");
  }
});

// RENDER UI
callAPI();

// HANDLE BUTTON TYPE TEMP
button.addEventListener("click", function () {
  if (button.innerHTML === "℉") {
    button.innerHTML = "℃";
  } else {
    button.innerHTML = "℉";
  }
  callAPI();
});

//CALL API
function callAPI() {
  fetch(handleSearch())
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const forecasts7Day = data.forecast.forecastday;
      const condition = data.forecast.forecastday[0].day;
      const todayForecast = data.forecast.forecastday[0].hour;
      const today = data.current;

      // RENDER TODAY
      let temprains = [];
      function handleTypeTempByToday() {
        let type;
        if (button.innerHTML !== "℃") {
          return (type = Math.round(today.temp_c) + "℃");
        } else {
          return (type = Math.round(today.temp_f) + "℉");
        }
      }
      temprains += `
        <div>
          <h1 class="mt-4">${data.location.name}</h1>
          <p>Chance of rain: ${condition.daily_chance_of_rain}%</p>
        </div>
        <h1 class="my-4">${handleTypeTempByToday()}</h1>
      `;
      temprain.innerHTML = temprains;
      suntoday.innerHTML = `
        <h3 class="mt-4 mx-2"> ${data.current.last_updated
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/")
          .slice(0, 5)}${data.location.localtime.slice(10)}
        </h3>
        <img src="${data.forecast.forecastday[0].day.condition.icon}"/>`;

      // RENDER TODAY'S FORECAST
      let datas = [];
      for (let i = 6; i < 24; i += 3) {
        function handleTypeTempByTodayForecast() {
          let type;
          if (button.innerHTML !== "℃") {
            return (type = Math.round(todayForecast[i].temp_c) + "℃");
          } else {
            return (type = Math.round(todayForecast[i].temp_f) + "℉");
          }
        }
        let time = todayForecast[i].time;
        datas += `
        <ul class="col-2">
          <li>${time.slice(11)}</li>
          <li><img src="${todayForecast[i].condition.icon}"/></li>
          <h5>${handleTypeTempByTodayForecast()}</h5>
        </ul>
      `;
      }
      todayforecast.innerHTML = datas;

      // RENDER AIR CONDITIONS
      let conditions = [];
      conditions += `
      <div class="col-5"><i class="fa-solid fa-temperature-three-quarters"></i>  Humidity <h4 class="px-4">${today.humidity}</h4></div>
      <div class="col-5"><i class="fa-solid fa-wind"> </i>  Wind <h4 class="px-4">${today.wind_kph}km/h</h4></div>
      <div class="col-5"><i class="fa-solid fa-droplet"></i>  Chance of Rain <h4 class="px-4">${condition.daily_chance_of_rain}%</h4></div>
      <div class="col-5"><i class="fa-solid fa-sun"></i>  UV Index <h4 class="px-4">${today.uv}</h4></div>
    `;
      windrain.innerHTML = conditions;

      // RENDER 7-DAY FORECAST
      let arrForecasts = [];
      forecasts7Day.map((forecast) => {
        function handleTypeTemp7DayForecast() {
          let type;
          if (button.innerHTML !== "℃") {
            return (type = Math.round(forecast.day.avgtemp_c) + "℃");
          } else {
            return (type = Math.round(forecast.day.avgtemp_f) + "℉");
          }
        }
        date = forecast.date.split("-").reverse().join("/");
        return (arrForecasts += `
        <ul class="row mt-2">
          <li class="col-3">${date.slice(0, 5)}</li>
          <li class="col-3"><img src="${forecast.day.condition.icon}"/> </li>
          <li class="col-3">${forecast.day.condition.text
            .split("possible")
            .join("")}</li>
          <li class="col-3">${handleTypeTemp7DayForecast()}</li>
        </ul>
      `);
      });

      dayforecast.innerHTML = arrForecasts;

      let timehour = parseInt(data.current.last_updated.slice(10, 13));
      let arrTime = [];
      let arrTemp = [];
      let arrHumidity = [];
      for (let i = 0; i < 8; i++) {
        if (timehour >= 24) {
          arrTime.push(
            data.forecast.forecastday[1].hour[timehour + 1 - 24].time.slice(11)
          );
          arrTemp.push(
            data.forecast.forecastday[1].hour[timehour + 1 - 24].temp_c
          );
          arrHumidity.push(
            data.forecast.forecastday[1].hour[timehour + 1 - 24].humidity
          );
        } else {
          arrTime.push(
            data.forecast.forecastday[0].hour[timehour + 1].time.slice(11)
          );
          arrTemp.push(data.forecast.forecastday[1].hour[timehour + 1].temp_c);
          arrHumidity.push(
            data.forecast.forecastday[1].hour[timehour + 1].humidity
          );
        }
        timehour = timehour + 3;
      }

      new Chart("tempChart", {
        type: "line",
        data: {
          labels: arrTime,
          datasets: [
            {
              data: arrTemp,
              borderColor: "red",
              fill: true,
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });
      new Chart("humidityChart", {
        type: "bar",
        data: {
          labels: arrTime,
          datasets: [
            {
              data: arrHumidity,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
              fill: true,
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });
    });
}

const btnSeemore = document.querySelector(".btn-seemore");
const modalSeemore = document.querySelector(".modal-seemore");
const modalClose = document.querySelector(".modal-close");
const modalcontainer = document.querySelector(".modal-container");

function showModal() {
  modalSeemore.classList.add("open");
}

btnSeemore.addEventListener("click", showModal);

function closeModal() {
  modalSeemore.classList.remove("open");
}

modalClose.addEventListener("click", closeModal);

modalSeemore.addEventListener("click", closeModal);

modalcontainer.addEventListener("click", function (event) {
  event.stopPropagation();
});

const btnTempChart = document.querySelector(".temp-chart");
const btnHumidityChart = document.querySelector(".humidity-chart");
const tempChart = document.querySelector("#tempChart");
const humidityChart = document.querySelector("#humidityChart");

btnHumidityChart.addEventListener("click", () => {
  btnHumidityChart.style.background = "black";
  btnTempChart.style.background = "#ccc";
  btnHumidityChart.style.color = "white";
  btnTempChart.style.color = "black";
  tempChart.style.display = "none";
  humidityChart.style.display = "flex";
});

btnTempChart.addEventListener("click", () => {
  btnTempChart.style.background = "black";
  btnHumidityChart.style.background = "#ccc";
  btnTempChart.style.color = "white";
  btnHumidityChart.style.color = "black";
  tempChart.style.display = "flex";
  humidityChart.style.display = "none";
});
