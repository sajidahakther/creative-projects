/*

    The drawing of the lines and paths begins once the camera detects movement. When the drawing has begun, and the cam picks up movement
    triangular shapes will appear on the drawing screen in areas where the motion was detected. These triangles are sound-reactive, so the size
    of the triangles increase/decreases according to the amplitude.

    When the webcam detects movement, particles (ellipses) begin floating out:
    - it's force is dependent on the movement
    - the direction in which they go is dependent on where the motion is detected.
         for instance, if there is movement from the right side, the partices will float towards the right,
                       if there is movement from the left side, the particles will floats towards the left
                       if there is movement from below, the particles will float upwards.

    When there is a lot of movement, the line drawing will begin fading out. Then the drawing will get the position of the particles x and y, and begin drawing from there.
         for example, camera detects movement from below, then particles float upwards, user stops moving, then line drawing begins and it latches onto the particles x,y
                      and begins drawing and it fades out upwards.
    Continuous movement for a period of time will stop the drawing. When movement stops for a moment, drawing begins again.
    You can see which movements have been detected by looking at the motion detection webcam which is the first cam on the top left hand corner.

    The drawing:
    The connected points (ellipses) are dependent on the sound, so it's size chages as the amplitude of the sound increases.
    The x co-ordinate of the line is dependent on the sound too, so when the amplitude increase, the point moves further down on the x axis
    The y co-ordinate of the line is set to a random height between certain integers so that it moves up/down and creates a zigzag line.

    Reference:
    - Motion detection: my previous work with the piano cam.
    - Inspiration for the drawing came from: https://p5js.org/examples/hello-p5-drawing.html
    - Audio sample: freesound.org

    */

// WEBCAM INTERACTION
var video;
var prevImg;
var currImg;
var diffImg;
var grid;
var threshold = 0.073;

// DRAWING
var paths = [];
var drawing = false;
var next = 0; // How long until the next circle
var current;
var previous;

// AUDIO - SOUND REACTIVE
var envF = new maximEx.envFollower();
var samplePlayer = new maximJs.maxiSample();
var amp;
var s = amp * 50;

function setup() {
 createCanvas(windowWidth, windowHeight);
 pixelDensity(1);
 video = createCapture(VIDEO);
 video.hide();
 grid = new Grid(windowWidth, windowHeight); // Drawing Grid

 current = createVector(0, 0);
 previous = createVector(0, 0);

 // AUDIO INPUT
 audio = new maximJs.maxiAudio();
 audio.play = playLoop;
 audio.init();
 audio.loadSample("assets/drawinglines.mp3", samplePlayer);
}

function playLoop() {
 var sig = samplePlayer.play();
 amp = envF.analyse(sig, 0.01, 0.5);
 this.output = sig;
}

function draw() {
 background(0);
 image(video, 160, 0, 160, 120);
 video.loadPixels();

 ////[ DRAWING ]////
 if (millis() > next && drawing) { // If it's time for a new point
  current.x = width * amp * 2; // The X co-ordinate of the line depends on the amplitude (it moves further on the X axis when the amp increases).
  current.y = random(height / 4, height / 2); // The Y co-ordinate of the line is set randomly so that it drops up and down (draws in a zigzag motion).

  var force = p5.Vector.sub(current, previous); // Particle's force is based on the movement
  force.mult(0.05);

  paths[paths.length - 1].add(current, force); // Add new particle

  next = millis() + random(100); // Scheduling the next circle
 }

 for (var i = 0; i < paths.length; i++) { // Drawing the paths
  paths[i].update();
  paths[i].display();
 }

 ////[ SETTING THE CAM FOR WEBCAM INTERACTION ]////
 var w = video.width / 4;
 var h = video.height / 4;

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

 // Drawing cam
 prevImg = createImage(w, h);
 prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, w, h);

 /* Adding a blur filter to elimate any noise and then creating the threshold filter,
 and setting the second parameter to 'threshold' which I've set the default value to 0.073.*/
 diffImg.filter(BLUR, 2);
 diffImg.filter(THRESHOLD, threshold);
 image(diffImg, 0, 0);

 grid.update(diffImg);
}

var Grid = function(_w, _h) {
 this.diffImg = 0;
 this.noteWidth = 40;
 this.worldWidth = _w;
 this.worldHeight = _h;
 this.numOfNotesX = int(this.worldWidth / this.noteWidth);
 this.numOfNotesY = int(this.worldHeight / this.noteWidth);
 this.arrayLength = this.numOfNotesX * this.numOfNotesY;
 this.noteStates = new Array(this.arrayLength).fill(0);
 this.noteStates = [];
 this.colourArray = [];

 // Setting the colour of the notes (making it transparent)
 for (var i = 0; i < this.arrayLength; i++) {
  this.colourArray.push(color(0, 5));
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

  // Note Aging
  for (var i = 0; i < this.arrayLength; i++) {
   this.noteStates[i] -= 0.05;
   this.noteStates[i] = constrain(this.noteStates[i], 0, 1);
  }

  this.draw();
 }

 this.draw = function() {
  push();
  noStroke();
  for (var x = 0; x < this.numOfNotesX; x++) {
   for (var y = 0; y < this.numOfNotesY; y++) {
    var posX = this.noteWidth / 2 + x * this.noteWidth;
    var posY = this.noteWidth / 2 + y * this.noteWidth;
    var noteIndex = x + (y * this.numOfNotesX);
    if (this.noteStates[noteIndex] > 0) {

     // First begins drawing when it detects movement
     next = 0;
     drawing = true;
     previous.x = posX;
     previous.y = posY;
     paths.push(new Path());

     stroke(255, 50);
     fill(this.colourArray[noteIndex]);
     // Positions of the movement detection + coordinate of the triangle * amplitude of the sound so that the shape moves.
     triangle(posX + 40 * amp, posY + 55 * amp, posX + 58 * amp, posY + 20 * amp, posX + 76 * amp, posY + 55 * amp);

    }
   }
  }
  pop();
 }
};

function Path() {
 this.particles = [];
 this.hue = random(0, 255);
}

Path.prototype.add = function(position, force) {
 this.particles.push(new Particle(position, force, this.hue)); // Add a new particle
}

Path.prototype.update = function() {
 for (var i = 0; i < this.particles.length; i++) {
  this.particles[i].update(); // Display path
 }
}

Path.prototype.display = function() {
 for (var i = this.particles.length - 1; i >= 0; i--) { // Loop through the particles backwards
  if (this.particles[i].lifespan <= 0) {
   this.particles.splice(i, 1); // Remove it when it ages
  } else {
   this.particles[i].display(this.particles[i + 1]); // Display it
  }
 }
}

// Particles along the path
function Particle(position, force, hue) {
 this.position = createVector(position.x, position.y);
 this.velocity = createVector(force.x, force.y);
 this.drag = 0.95;
 this.lifespan = 150;
}

Particle.prototype.update = function() {
 this.position.add(this.velocity); // Move it
 this.velocity.mult(this.drag); // Slow it down
 this.lifespan--; // Fade it out
}

////[ DRAWINGS ON SCREEN ]////
Particle.prototype.display = function(other) {
 var s = amp * 50; // Size w/h
 var px = this.position.x;
 var py = this.position.y + 50;
 var py2 = this.position.y + 150;

 noStroke();
 fill(0, random(0, 200), random(100, 255), this.lifespan / 2);
 ellipse(px, py, s, s);

 fill(200, this.lifespan / 2);
 ellipse(px, py2, s, s);

 if (other) {
  var opx = other.position.x;
  var opy = other.position.y + 50;
  var opy2 = other.position.y + 150;

  // Purple drawing
  stroke(random(100, 255), 0, random(200, 255), this.lifespan);
  line(px, py, opx, opy);

  // Blue drawing
  stroke(0, random(100, 255), random(200, 255), this.lifespan);
  line(px, py2, opx, opy2);
 }
}
