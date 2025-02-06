const axios = require("axios");
const { weatherTemp } = require("../weatherTemp");

jest.mock("axios");

test("should return error message if Rdays is negative", async () => {
  const result = await weatherTemp(0, 0, -1, "dummy_key");
  expect(result).toEqual({
    message: "Date cannot be in the past",
    error: true,
  });
});

test("should return current weather data if Rdays is within range", async () => {
  axios.get.mockResolvedValue({
    data: {
      data: [{ weather: { description: "Clear" }, temp: 20 }],
    },
  });

  const result = await weatherTemp(0, 0, 3, "dummy_key");
  expect(result).toEqual({ description: "Clear", temp: 20 });
});

test("should return forecast weather data if Rdays is greater than 7", async () => {
  axios.get.mockResolvedValue({
    data: {
      data: [
        {
          weather: { description: "Partly Cloudy" },
          temp: 22,
          app_max_temp: 25,
          app_min_temp: 18,
        },
      ],
    },
  });

  const result = await weatherTemp(0, 0, 8, "dummy_key");
  expect(result).toEqual({
    description: "Partly Cloudy",
    temp: 22,
    app_max_temp: 25,
    app_min_temp: 18,
  });
});
