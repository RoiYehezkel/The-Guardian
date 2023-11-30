require("dotenv").config();
const mongoose = require("mongoose");
require("../db/db_connection");
require("../db/userModel");
const User = mongoose.model("user");
const { setUpInstagram } = require("../dataMining/setUpInstagram");
const { labelsFromImg } = require("../parsingData/labelsFromImg");
const { faceDetection } = require("../parsingData/face-detection");
const { getLocations } = require("../parsingData/stringToLoc");

const setUpData = async (token) => {
  // get posts array from instagram
  const { userId, posts_data } = await setUpInstagram(token);

  try {
    const user = new User({
      user_id: userId,
      data: {},
      Status: "In-Progress",
    });

    // save data with status "In-Progress"
    await user.save();

    // build analyzed data
    analyzeData(userId, posts_data.data);
  } catch (error) {
    console.log(`error by creating new user ${error}`);
  }

  return userId;
};

async function analyzeData(userId, posts) {
  // build json for user
  const postsAmount = posts.length;
  const facesData = await faceDetection(posts);
  const locationsData = await getLocations(posts);
  //the labels from img returns an array with both labels data and freq and category array
  const visionData = await labelsFromImg(posts);
  const labelsData = visionData[0];
  const categoryData = visionData[1]; // is an array of objects - category, and the number of lables assigned to it

  const res = {};
  res.posts = postsAmount;
  res.relatives = facesData;
  res.locations = locationsData;
  res.labels = categoryData;
  // res.categoryData = categoryData;

  // update object data and status to "Done"
  await User.findOneAndUpdate(
    { user_id: userId },
    { data: res, Status: "Done" }
  );
}

async function getAnalyzedDataFromDb(userId) {
  let postsData = await User.find({ user_id: userId });
  if (postsData.length != 0 && postsData[0].Status === "Done") {
    await User.findOneAndDelete({ user_id: userId });
    return postsData;
  } else if (postsData.length != 0 && postsData[0].Status === "In-Progress") {
    return [{ Status: "In-Progress" }];
  } else {
    return [{ Status: "not-found" }];
  }
}

module.exports = {
  setUpData,
  getAnalyzedDataFromDb,
};
