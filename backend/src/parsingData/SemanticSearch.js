let natural = require("natural");
const fs = require("fs");

async function semanticCategoryCreationForArray(labelArrayObjects) {
  let categoryResult;
  let Wordsclassifier = new natural.BayesClassifier();

  let category_array = [];
  for (let index = 0; index < labelArrayObjects.length; index++) {
    const element = labelArrayObjects[index];
    categoryResult = await semanticCategoryCreation(
      element.string,
      Wordsclassifier
    );

    let existingIndex = findIndexByValueInArray(category_array, categoryResult);
    if (categoryResult && existingIndex === -1) {
      let obj = {};
      obj.str = categoryResult;
      obj.labelCount = 0;
      category_array.push(obj);
    } else if (existingIndex !== -1) {
      category_array[existingIndex].labelCount++;
    }
  }

  return category_array;
}

function findIndexByValueInArray(array, searchValue) {
  return array.findIndex((obj) => obj.str === searchValue);
}

async function semanticCategoryCreation(label, Wordsclassifier) {
  await trainClassifier(Wordsclassifier);
  return Wordsclassifier.classify(label);
}

async function trainClassifier(Wordsclassifier) {
  Wordsclassifier.addDocument(
    "Smile Light Happy Leisure Fun Cool Event ",
    "General"
  );
  Wordsclassifier.addDocument(
    "Hairstyle Bracelet Fashion accessory Cap Hat Body jewelry Jewellery Earrings making Sleeve Blazer T-shirt" +
      "Shoe Sneakers Jeans Trousers Shorts Textile",
    "A Fashion Enthusiast "
  );
  Wordsclassifier.addDocument(
    " Field archery Arrow Target Elbow ",
    "An Archer"
  );
  Wordsclassifier.addDocument(
    " Road Mountain Path Boots Wood Bird Lake Tints and shades Branch Natural Twig landscape Asphalt Travel Terrestrial plant Tree Botany Grass Sunlight Lake Tints and shades Branch Natural Twig Grass Plant Flower Houseplant Flowerpot Cloud ",
    " Hiking and Travelling"
  );

  Wordsclassifier.addDocument(" Font Words Typography Document", "Writing");

  Wordsclassifier.addDocument(" Cigarette Smoke    ", "Smoker");

  Wordsclassifier.addDocument(
    "   Goggles Sunglasses  Vision care eye  ",
    "Glasses- wearer"
  );
  Wordsclassifier.addDocument(
    " Music guitar drums band flute trumpet Artist Musician Musical instrument Concert Microphone Guitarist String instrument   ",
    "Music Lover"
  );
  Wordsclassifier.addDocument(
    " Military camouflage uniform Marines Cargo pants Soldier Army Squad    ",
    "Extolling Army Service"
  );
  Wordsclassifier.addDocument(
    " Horse dog cat cow bird crow breed Whiskers Companion Snout Pet Retriever Carnivore   ",
    "Animal Lover"
  );

  await Wordsclassifier.train();
}

module.exports = semanticCategoryCreationForArray;
