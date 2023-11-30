// // Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
const fs = require("fs");
const fetch = require("node-fetch");
let semanticCategoryCreationForArray = require("./SemanticSearch");

async function labelsFromImg(postsArray) {
  let postCategories = [];
  let categoryLableArray = [];
  let semanticsCategories = [];

  for (let index = 0; index < postsArray.length; index++) {
    let post = postsArray[index];
    let postImg = post.media_url;
    if (post.media_type === "CAROUSEL_ALBUM" || post.media_type === "IMAGE") {
      await download(postImg);
      try {
        postCategories = await setEndpoint("./image.jpg");
      } catch (err) {
        console.log(err);
      }
      categoryLableArray.push(postCategories);
      if (index === postsArray.length - 1)
        try {
          fs.unlinkSync("./image.jpg");

          console.log("Delete File successfully.");
        } catch (error) {
          console.log(error);
        }
    }
  }
  categoryLableArray = crossRefrence(categoryLableArray);

  semanticsCategories = await semanticCategoryCreationForArray(
    categoryLableArray
  );

  return [categoryLableArray, semanticsCategories];
}

async function download(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(`./image.jpg`, buffer, () =>
    console.log("finished downloading!")
  );
}

async function setEndpoint(postImg) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: `./certs/keycred-secret.json`,
  });

  let [result] = await client.labelDetection(`${postImg}`);
  let labels = result.labelAnnotations;

  let labelArray = [];
  if (labels) {
    for (let label of labels) {
      labelArray.push(label.description);
    }
  }

  return labelArray;
}

//function to cross refrence the labels and add id, and frequency to them
function crossRefrence(labelArray) {
  let result = {};
  for (let i = 0; i < labelArray.length; i++) {
    for (let j = 0; j < labelArray[i].length; j++) {
      if (result[labelArray[i][j]]) {
        result[labelArray[i][j]]++;
      } else {
        result[labelArray[i][j]] = 1;
      }
    }
  }
  let id = 0;
  let frequencies = Object.keys(result).map((key) => ({
    string: key,
    frequency: result[key],
    id: id++,
  }));
  return frequencies.filter((obj) => obj.frequency > 1);
}

module.exports = { labelsFromImg };
