
const axios = require("axios");

const getCityPic = async (city, key) => {
  try {
    const { data } = await axios.get(
        `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(city)}&image_type=photo`
    );

    if (data.hits.length > 0) {
      return { image: data.hits[0].webformatURL };
    } else {
      return { image: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1" };
    }
  } catch (error) {
    console.error("Error fetching city image:", error.message);
    return { image: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1" };
  }
};

module.exports = {
  getCityPic,
};

