require("dotenv").config();
const axios = require("axios");

const setUpInstagram = async (code) => {
  let accessToken = null;
  let userId = null;
  try {
    // send form based request to Instagram API
    let result = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      {
        client_id: process.env.INSTA_APP_ID,
        client_secret: process.env.INSTA_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.OAUTH_URI,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Got access token.
    accessToken = result.data.access_token;
    userId = result.data.user_id;

    // get data from user account
    result = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );
    const posts_data = result.data;
    if (!posts_data) {
      throw new Error("No valid data found");
    }
    return { userId: userId, posts_data: posts_data };
  } catch (error) {
    console.log(`error by creating new user ${error}`);
  }
};

module.exports = {
  setUpInstagram,
};
