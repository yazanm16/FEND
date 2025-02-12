
const axios = require("axios");

const weatherTemp = async (lo, la, Rdays, key) => {
    try {
        if (!lo || !la || Rdays === undefined) {
            return { error: true, message: "Missing required parameters" };
        }

        if (typeof Rdays !== "number" || Rdays < 0) {
            return { error: true, message: "Invalid date value" };
        }

        if (Rdays === 0 || Rdays <= 7) {
            const { data } = await axios.get(
                `https://api.weatherbit.io/v2.0/current?lat=${la}&lon=${lo}&units=M&key=${key}`
            );

            if (!data || !data.data.length) {
                return { error: true, message: "No weather data available" };
            }

            const { weather, temp } = data.data[data.data.length - 1];
            return { description: weather.description, temp };
        } else {
            const { data } = await axios.get(
                `https://api.weatherbit.io/v2.0/forecast/daily?lat=${la}&lon=${lo}&units=M&days=${Rdays}&key=${key}`
            );

            if (!data || !data.data.length) {
                return { error: true, message: "No forecast data available" };
            }

            const { weather, temp, app_max_temp, app_min_temp } =
                data.data[data.data.length - 1];

            return { description: weather.description, temp, app_max_temp, app_min_temp };
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return { error: true, message: "Failed to fetch weather data" };
    }
};

module.exports = {
    weatherTemp,
};
