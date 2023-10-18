const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Executing all the functions in IOhandler.js
 *
 * Created Date: Oct 17, 2023
 * Author: Jessie Kim
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "./myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => console.log("Extraction operation complete"))
  .then (() => IOhandler.readDir(pathUnzipped, ".png"))
  .then(paths => {
    let images = []
    for (let i = 0; i < paths.length; i++) {
      let pathIn = path.join(pathUnzipped, paths[i]);
      let pathOut = path.join(pathProcessed, path.basename(pathIn));
      images.push(IOhandler.grayScale(pathIn, pathOut));
    }
    return Promise.all(images);
  })
  .catch((error) => console.error("Error.main:", error))

// step 1: read the zip file
// step 2: unzip the zip file
// step 3: read all png images from unzipped folder
// step 4: send them to the grayscle filter function
// step 5: after all images have successfully been grayscaled, show a success message.
// Use Promise.all to initiate grayscaling of multiple images simultaneously, and then ensure that the .then method is executed afterward.