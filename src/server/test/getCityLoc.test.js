const mockReq = require("jest-mock-express").request;
const mockRes = require("jest-mock-express").response;
const axios = require("axios");
const { getCityLoc } = require("../getCityLoc");

jest.mock("axios");

test("should return an error message if no city is found", async () => {
  axios.get.mockResolvedValue({
    data: { geonames: [] },
  });

  const result = await getCityLoc("InvalidCityName", "dummy_username");
  expect(result).toEqual({
    message: "No city with that name. Please make sure of your spelling",
    error: true,
  });
});

test("should return city data if a valid city is provided", async () => {
  axios.get.mockResolvedValue({
    data: {
      geonames: [{ geonameId: 1, name: "ValidCity" }],
    },
  });

  const result = await getCityLoc("ValidCityName", "dummy_username");
  expect(result).toEqual({ geonameId: 1, name: "ValidCity" });
});
