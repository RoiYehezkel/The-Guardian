import axios from "axios";

export async function setupInsta() {
  const appId = process.env.REACT_APP_INSTA_APP_ID;
  const redUri = process.env.REACT_APP_OAUTH_URI;
  let url = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redUri}&scope=user_profile,user_media&response_type=code`;
  const left = window.screen.width / 2 - 600 / 2;
  const top = window.screen.height / 2 - 600 / 2;
  const features = `left=${left},top=${top},width=${600},height=${600}`;
  window.open(url, "_blank", features)?.focus();
}

export async function getAnalyze(userId) {
  try {
    const response = await axios.post("http://localhost:8000/analyze", {
      userId: userId,
    });
    const result = response.data[0];

    if (result.Status === "not-found") {
      alert("User doesn't exist");
    } else if (result.Status === "In-Progress") {
      alert("Your profile's inspection is underway");
    } else {
      return result.data;
    }
  } catch (err) {
    alert("Server Unavailable");
  }
}
