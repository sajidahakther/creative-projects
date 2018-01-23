// Webcam Piano TEMPLATE
var video;
var prevImg;
var currImg;
var diffImg;
var grid;
var threshold = 0.073;

function setup() {
 createCanvas(windowWidth, windowHeight);
 pixelDensity(1);
 video = createCapture(VIDEO);
 video.hide();
 grid = new Grid(640, 480);
}

function draw() {
 background(125);
 image(video, 0, 0);
 video.loadPixels();

 // Variables for the width and height of the video
 var w = video.width / 4;
 var h = video.height / 4;


 // CREATING THE VIDEOS & SETTING FILTERS

 // Grayscale cam
 currImg = createImage(w, h);
 currImg.copy(video, 0, 0, video.width, video.height, 0, 0, w, h); // save current frame
 currImg.filter("gray");
 currImg.filter(BLUR, 3);

 // Threshold cam
 diffImg = createImage(w, h);

 if (typeof prevImg !== 'undefined') {
  prevImg.loadPixels();
  currImg.loadPixels();
  diffImg.loadPixels();

  for (var x = 0; x < currImg.width; x += 1) {
   for (var y = 0; y < currImg.height; y += 1) {

    // MAGIC HAPPENS HERE
    // Calculating the index of the pixel using the x and y values of the for loops.
    var index = (x + (y * currImg.width)) * 4;

    /* Getting the red channel in currImg and the red channel in prevImg,
    then calculating the absolute difference from each red channel. */
    var r1 = currImg.pixels[index + 0];
    var r2 = prevImg.pixels[index + 0];
    var diff = abs(r1 - r2);

    /* Storing the absolute difference result in all 3 RGB channels
    of the diffImg, and then setting the alpha to white. */
    diffImg.pixels[index + 0] = diff;
    diffImg.pixels[index + 1] = diff;
    diffImg.pixels[index + 2] = diff;
    diffImg.pixels[index + 3] = 255;

   }
  }

  diffImg.updatePixels();
 }
 image(currImg, 640, 0);

 // Main piano cam
 prevImg = createImage(w, h);
 prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, w, h);

 /* Adding a blur filter to elimate any noise and then creating the threshold filter,
 and setting the second parameter to 'threshold' which I've set the default value to 0.073.*/
 diffImg.filter(BLUR, 2);
 diffImg.filter(THRESHOLD, threshold);
 image(diffImg, 800, 0);

 grid.update(diffImg);
}

function mousePressed(prevImg) {
 /* Mouse clicks across the width of the prevImg changes the threshold from the range 0-1. */
 threshold = map(mouseX, 0, width, 0, 1);
 return threshold;
 //console.log("threshold adjusted");
}

var Grid = function(_w, _h) {
 this.diffImg = 0;
 this.noteWidth = 20; //changed the width of the note
 this.worldWidth = _w;
 this.worldHeight = _h;
 this.numOfNotesX = int(this.worldWidth / this.noteWidth);
 this.numOfNotesY = int(this.worldHeight / this.noteWidth);
 this.arrayLength = this.numOfNotesX * this.numOfNotesY;
 this.noteStates = [];
 this.noteStates = new Array(this.arrayLength).fill(0);
 this.colorArray = [];
 console.log(this);
 console.log(_w, _h);

 // set the original colors of the notes
 for (var i = 0; i < this.arrayLength; i++) {
  /* Setting the red and blue values of the colorArray to random values between the ranges
  0-100 to produce a dark, cool-toned, neutral colour palette. I set the alpha to a random
  value from 0-255 to handle the oppacity of the colours.*/
  this.colorArray.push(color(random(100), 0, random(100), random(255)));
 }

 this.update = function(_img) {
  this.diffImg = _img;
  this.diffImg.loadPixels();
  for (var x = 0; x < this.diffImg.width; x += 1) {
   for (var y = 0; y < this.diffImg.height; y += 1) {
    var index = (x + (y * this.diffImg.width)) * 4;
    var state = diffImg.pixels[index + 0];
    if (state == 255) {
     var screenX = map(x, 0, this.diffImg.width, 0, this.worldWidth);
     var screenY = map(y, 0, this.diffImg.height, 0, this.worldHeight);
     var noteIndexX = int(screenX / this.noteWidth);
     var noteIndexY = int(screenY / this.noteWidth);
     var noteIndex = noteIndexX + noteIndexY * this.numOfNotesX;
     this.noteStates[noteIndex] = 1;
    }
   }
  }

  //this is what "ages" the notes so that as time goes by things can change.
  for (var i = 0; i < this.arrayLength; i++) {
   this.noteStates[i] -= 0.05;
   this.noteStates[i] = constrain(this.noteStates[i], 0, 1);
  }

  this.draw();
 };

 // this is where each note is drawn
 // use can use the noteStates variable to affect the notes as time goes by
 // after that region has been activated
 this.draw = function() {
  push();
  noStroke();
  for (var x = 0; x < this.numOfNotesX; x++) {
   for (var y = 0; y < this.numOfNotesY; y++) {
    var posX = this.noteWidth / 2 + x * this.noteWidth;
    var posY = this.noteWidth / 2 + y * this.noteWidth;
    var noteIndex = x + (y * this.numOfNotesX);
    if (this.noteStates[noteIndex] > 0) {
     fill(this.colorArray[noteIndex]);
     /* Multiplying the width and height of the rectangle with noteStates[noteIndex]
     so that it fades out as it ages. */
     rect(posX, posY, this.noteWidth * this.noteStates[noteIndex], this.noteWidth * this.noteStates[noteIndex]);
     rotate(rect);

    }
   }
  }
  pop();
 }
};
