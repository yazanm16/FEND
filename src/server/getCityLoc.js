

const axios = require("axios");

const getCityLoc = async (city, username) => {
    try {
        const { data } = await axios.get(
            `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`
        );

        if (!data.geonames || data.geonames.length === 0) {
            return {
                message: "No city with that name. Please make sure of your spelling",
                error: true,
            };
        }

        return data.geonames[0];
    } catch (error) {
        return {
            message: "Error fetching city data. Please try again later.",
            error: true,
        };
    }
};

module.exports = { getCityLoc };
