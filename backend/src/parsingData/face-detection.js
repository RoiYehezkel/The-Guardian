const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const faceDetection = async (postsArray) => {
  // load models
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");

  // get array of single images
  let singleFaces = await extractFaces(postsArray);
  // sort array by size of image
  singleFaces = singleFaces.sort((f1, f2) =>
    f1.width < f2.width ? 1 : f1.width > f2.width ? -1 : 0
  );
  // search for match in different images
  let result = [];
  let id = 1;
  for (let i = 0; i < singleFaces.length; i++) {
    console.log(`size of current image: ${singleFaces[i].width}`);
    if (singleFaces[i].status === 0) {
      singleFaces[i].status = 1;
      result = [...result, { id: id, image: singleFaces[i].image, freq: 1 }];
      id += 1;
      for (let j = i; j < singleFaces.length; j++) {
        if (singleFaces[j].status === 0) {
          const ans = await findMatchBetweenFaces(
            singleFaces[i].image,
            singleFaces[j].image
          );
          if (ans) {
            singleFaces[j].status = 1;
            result[result.length - 1].freq += 1;
          }
        }
      }
    }
  }

  // convert image from canvas to HTML element
  for (let i = 0; i < result.length; i++) {
    result[i].image = result[i].image[0].toDataURL();
  }
  // sort array by freq
  result = result.sort((f1, f2) =>
    f1.freq < f2.freq ? 1 : f1.freq > f2.freq ? -1 : 0
  );
  // delete image with freq = 1
  result = result.filter((face) => face.freq > 1);

  return result;
};

// build array of faces
const extractFaces = async (arrayOfPosts) => {
  let imagesArray = [];
  for (let i = 0; i < arrayOfPosts.length; i++) {
    if (
      arrayOfPosts[i].media_type === "IMAGE" ||
      arrayOfPosts[i].media_type === "CAROUSEL_ALBUM"
    ) {
      const image = await canvas.loadImage(arrayOfPosts[i].media_url);
      const detections = await faceapi.detectAllFaces(image);

      if (detections && detections.length < 10) {
        for (let j = 0; j < detections.length; j++) {
          const regionsToExtract = [
            new faceapi.Rect(
              detections[j]._box._x - 25,
              detections[j]._box._y - 40,
              detections[j]._box._width + 50,
              detections[j]._box._height + 80
            ),
          ];
          let faceImages = await faceapi.extractFaces(image, regionsToExtract);
          imagesArray = [
            ...imagesArray,
            {
              image: faceImages,
              status: 0,
              width: detections[j]._box._width + 50,
            },
          ];
        }
      }
    }
  }
  return imagesArray;
};

// find match between faces
const findMatchBetweenFaces = async (img1, img2) => {
  const facesFromImage1 = await faceapi
    .detectSingleFace(img1)
    .withFaceLandmarks()
    .withFaceDescriptor();

  const facesFromImage2 = await faceapi
    .detectSingleFace(img2)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (facesFromImage1) {
    const faceMatcher = new faceapi.FaceMatcher(facesFromImage1);

    if (facesFromImage2) {
      const bestMatch = faceMatcher.findBestMatch(facesFromImage2.descriptor);
      if (faceMatcher.labeledDescriptors[0].label === bestMatch._label) {
        return true;
      }
    }
  }
  return false;
};

module.exports = { faceDetection };
