const mockReq = require("jest-mock-express").request;
const mockRes = require("jest-mock-express").response;
const axios = require("axios");
const { getCityPic } = require("../getCityPic");

jest.mock("axios");

test("should return a default image if no city is found", async () => {
  axios.get.mockResolvedValue({
    data: { hits: [] },
  });

  const result = await getCityPic("InvalidCityName", "dummy_key");
  expect(result).toEqual({
    image:
      "https://source.unsplash.com/random/640x480?city,morning,night?sig=1",
  });
});

test("should return city image if a valid city is provided", async () => {
  axios.get.mockResolvedValue({
    data: {
      hits: [{ webformatURL: "https://example.com/validcity.jpg" }],
    },
  });

  const result = await getCityPic("ValidCityName", "dummy_key");
  expect(result).toEqual({ image: "https://example.com/validcity.jpg" });
});
