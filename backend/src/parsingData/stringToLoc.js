require("dotenv").config();
const axios = require("axios");

const getLocations = async (postsArray) => {
  const locations = [];
  let id = 1;
  for (let index = 0; index < postsArray.length; index++) {
    const location = await getLocationFromString(postsArray[index].caption);
    if (location && location.candidates && location.candidates.length > 0) {
      if (
        location.candidates[0].name.toLowerCase().indexOf("undefined") === -1
      ) {
        locations.push({
          id: id,
          location: location.candidates[0].name,
          date: postsArray[index].timestamp.substring(0, 10),
        });
        id += 1;
      }
    }
  }
  return locations;
};

const getLocationFromString = async (possible_location) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
    possible_location +
    "&inputtype=textquery&language=en&fields=name&key=" +
    API_KEY;

  let config = {
    method: "get",
    url: `${url}`,
    headers: {},
  };
  const response = await axios(config);
  return response.data;
};

module.exports = { getLocations };
