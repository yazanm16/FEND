

import axios from "axios";

const form = document.querySelector("form");
const cityInput = document.querySelector("#city");
const dateInput = document.querySelector("#flightDate");
const cityError = document.querySelector("#city_error");
const dateError = document.querySelector("#date_error");

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!validateInputs()) return;

  const cityLocation = await fetchCityLocation();
  if (cityLocation?.error) {
    displayError(cityError, cityLocation.message);
    return;
  }

  const { lng, lat, name } = cityLocation;
  if (!dateInput.value) {
    displayError(dateError, "Please enter the date");
    return;
  }

  const remainingDays = getRemainingDays(dateInput.value);
  const weather = await getWeather(lng, lat, remainingDays);
  if (weather?.error) {
    displayError(dateError, weather.message);
    return;
  }

  const pic = await getCityPic(name);
  updateUI(remainingDays, name, pic, weather);
};

const validateInputs = () => {
  clearErrors();
  if (!cityInput.value) return displayError(cityError, "Enter the city!!");
  if (!dateInput.value) return displayError(dateError, "Enter the date!!");
  if (getRemainingDays(dateInput.value) < 0)
    return displayError(dateError, "The date cannot be in the past");
  return true;
};

const fetchCityLocation = async () => {
  if (!cityInput.value) return displayError(cityError, "This field cannot be left empty");
  const { data } = await axios.post("http://localhost:8000/getCity", form, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const getWeather = async (lng, lat, remainingDays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lng,
    lat,
    remainingDays,
  });
  return data;
};

const getRemainingDays = (date) => {
  const timeDiff = new Date(date) - new Date();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const getCityPic = async (cityName) => {
  const { data } = await axios.post("http://localhost:8000/getCityPic", { city_name: cityName });
  return data.image;
};

const updateUI = (days, city, pic, weather) => {
  document.querySelector("#Rdays").textContent = `Your trip starts in ${days} days from now`;
  document.querySelector(".cityName").textContent = `Location: ${city}`;
  document.querySelector(".weather").textContent = days > 7 ? `Weather is: ${weather.description}` : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").textContent = days > 7 ? `Forecast: ${weather.temp}°C` : `Temperature: ${weather.temp}°C`;
  document.querySelector(".max-temp").textContent = days > 7 ? `Max-Temp: ${weather.app_max_temp}°C` : "";
  document.querySelector(".min-temp").textContent = days > 7 ? `Min-Temp: ${weather.app_min_temp}°C` : "";
  document.querySelector(".cityPic").innerHTML = `<img src="${pic}" alt="An image that describes the city nature">`;
  document.querySelector(".flight_data").style.display = "block";
};

const displayError = (element, message) => {
  element.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  element.style.display = "block";
};

const clearErrors = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";
};

export { handleSubmit };
