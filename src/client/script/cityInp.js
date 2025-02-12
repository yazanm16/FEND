import axios from "axios";
const form = document.getElementsByTagName("form")[0];
const cityInput = document.getElementById("city");
const dateInput = document.getElementById("flightDate");

const cityError = document.getElementById("city_error");
const dateError = document.getElementById("date_error");

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!validate_inputs()) {
    return;
  }

  const CityLocation = await fetchCityLocation();

  if (CityLocation && CityLocation.error) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${CityLocation.message}`;
    cityError.style.display = "block";
    return;
  } else if (CityLocation && !CityLocation.error) {
    const { lng, lat, name } = await CityLocation;

    const date = dateInput.value;

    if (!date) {
      console.log("please enter the date");
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
      dateError.style.display = "block";
      return;
    }

    if (lng && lat) {
      const remainingDays = getRdays(date);

      const weather = await getWeather(lng, lat, remainingDays);
      if (weather && weather.error) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
        dateError.style.display = "block";
        return;
      }
      //get the picture of the place
      const pic = await getCityPic(name);
      updateUI(remainingDays, name, pic, weather);
    }
  }
};

const validate_inputs = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";
  if (!cityInput.value) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Enter the city!!`;
    cityError.style.display = "block";
    return;
  }
  if (!dateInput.value) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Enter the date!!`;
    dateError.style.display = "block";
    return;
  }
  if (getRdays(dateInput.value) < 0) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>The date cannot be in the past`;
    dateError.style.display = "block";
    return;
  }
  cityError.style.display = "none";
  dateError.style.display = "none";

  return true;
};

const fetchCityLocation = async () => {
  if (cityInput.value) {
    const { data } = await axios.post("http://localhost:8000/getCity", form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } else {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> This field cannot be left empty`;
    cityError.style.display = "block";
  }
};

const getWeather = async (lng, lat, remainingDays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lng,
    lat,
    remainingDays,
  });

  return data;
};

const getRdays = (date) => {
  // Set the start and end dates
  const startDate = new Date();
  const endDate = new Date(date);

  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - startDate.getTime();

  // Convert the time difference to days,output it
  return  Math.ceil(timeDiff / (1000 * 3600 * 24));
};

//getting the city picture from pixabay
const getCityPic = async (city_name) => {
  const { data } = await axios.post("http://localhost:8000/getCityPic", {
    city_name,
  });
  const { image } = await data;
  return image;
};

const updateUI = (Rdays, city, pic, weather) => {
  document.querySelector("#Rdays").innerHTML = `
  Your trip starts in ${Rdays} days from now
  `;
  document.querySelector(".cityName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather").innerHTML =
    Rdays > 7
      ? `Weather is: ${weather.description}`
      : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML =
    Rdays > 7
      ? `Forecast: ${weather.temp}&degC`
      : `Temperature: ${weather.temp} &deg C`;
  document.querySelector(".max-temp").innerHTML =
    Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").innerHTML =
    Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `
   <image 
   src="${pic}" 
   alt="an image that describes the city nature"
   >
   `;
  document.querySelector(".flight_data").style.display = "block";
};

export { handleSubmit };
