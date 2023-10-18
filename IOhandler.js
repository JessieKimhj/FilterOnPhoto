/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Oct 17, 2023
 * Author: Jessie Kim
 *
 */
const unzipper = require("unzipper"),
  { pipeline } = require("stream"),
  AdmZip = require('adm-zip');
  fs = require('fs'),
  path = require('path'),
  PNG = require('pngjs').PNG;

function parsedHandler() {
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      const idx = (this.width * y + x) << 2;
      const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
      this.data[idx] = avg;
      this.data[idx + 1] = avg;
      this.data[idx + 2] = avg;
    }
  }
      return this.pack();
};

/**  
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => 
  new Promise((resolve, reject) => {
    try {
        let zip = new AdmZip(pathIn);
        zip.extractAllToAsync(pathOut, true, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    } catch (err) {
        reject(err);
    }
});
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir, extension) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const pngFiles = files.filter(
          (file) => 
          path.extname(file) === extension
          );
        resolve(pngFiles);
      }
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) =>{
    const readablestream = fs.createReadStream(pathIn);
    const pixelTransform = new PNG({}).on("parsed", parsedHandler);
    const writableStream = fs.createWriteStream(pathOut);
      
    pipeline(
      readablestream,
      pixelTransform,
      writableStream,
      (error) => {
        if (error) {
          console.log("Error in pipeline:", error);
          reject(error);
        } else {
          resolve();
        }
      }
    )
  });
}
module.exports = {
  unzip,
  readDir,
  grayScale,
};
