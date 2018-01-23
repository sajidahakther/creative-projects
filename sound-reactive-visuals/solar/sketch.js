var envF = new maximEx.envFollower();
var samplePlayer = new maximJs.maxiSample();
var amp;
var particles = [];
var speed;

function setup() {
 createCanvas(windowWidth, windowHeight);

 //AUDIO INPUT
 audio = new maximJs.maxiAudio();
 audio.play = playLoop;
 audio.init();
 audio.loadSample("assets/2.wav", samplePlayer);

 //RADIATION
 for (var i = 0; i < 800; i++) {
  particles[i] = new Particles();
 }
}

function playLoop() {
 var sig = samplePlayer.play();
 amp = envF.analyse(sig, 0.01, 0.5);
 this.output = sig;

}

function draw() {
 background(255);

 //RADIATION: setting and displaying particles
 speed = map(width, 0, width, 0, 50);
 translate(width / 2, height / 2);
 for (var i = 0; i < particles.length; i++) {
  particles[i].update();
  particles[i].show();
 }

 /* Experimented and created a variety of variables that'll control the angle, x co-ordinate
 and size of shape, using PI, perlin noise, framecount and the amplitude. */

 //ANGLES
 var a1 = TWO_PI * noise(0.01 * frameCount + 10);
 var a2 = TWO_PI * noise(0.01 * frameCount + 20);
 var a3 = TWO_PI * noise(0.01 * frameCount + 30);

 //X CO-ORDINATE
 var x1 = 60 * noise(0.01 * frameCount + 40);
 var x2 = 200 * noise(0.01 * frameCount + 50);

 //SIZE OF SHAPE
 var p = amp * 5;
 var s1 = 200 * noise(0.01 * frameCount + 60) * p;
 var s2 = 50 * noise(0.01 * frameCount + 60) * p;


 //SOLAR ENERGY
 /* Layering a loop of shapes to create a pattern, and incorporating the variables
 I have created to make my shapes move accordingly. */

 for (i = 0; i < 30; i++) {
  push();
  fill(255, 184, 0, 30); //yellow
  stroke(255, 184, 0, 100);
  rotate(a3 + i / 4.77);
  triangle(0, -200, -10, s1, 10, s1);
  pop();

  push(); //red
  fill(255, 0, 0, 10);
  stroke(200, 0, 80, 90);
  rotate(a2 + i / 4.77);
  triangle(0, -200, -20, s2, 20, s2);
  pop();
 }

 for (i = 0; i < 30; i++) {
  push();
  fill(255, 0, 10, 10); //dark orange
  stroke(219, 59, 13, 90);
  rotate(a3 + i / 4.77);
  translate(x2, 0);
  triangle(0, -200, -10, s1, 10, s1);
  pop();
 }

 for (i = 0; i < 18; i++) {
  push();
  fill(223, 85, 45, 10); //light orange
  stroke(223, 85, 45, 30);
  rotate(a1 + TWO_PI * i / 18);
  translate(x1, 0);
  for (var j = 0; j < 16; j++) {
   push();
   rotate(a2 + TWO_PI * j / 16);
   translate(x1, 0);
   rotate(a1);
   triangle(0, -100, -10, s2, 10, s2);
   pop();
  }
  pop();
 }

}

//RADIATION

function Particles() {
 this.x = random(-width, width);
 this.y = random(-height, height);
 this.z = random(width);
 this.zp = this.z;

 this.update = function() {
  this.z = this.z - speed;
  if (this.z < 1) {
   this.z = width;
   this.x = random(-width, width);
   this.y = random(-height, height);
   this.zp = this.z; //particles move out towards the width of the screen
  }
 }

 this.show = function() {
  fill(255, 0, 0, 20);
  noStroke();

  var sx = map(this.x / this.z, 0, 1, 0, width);
  var sy = map(this.y / this.z, 0, 1, 0, height);
  var r = map(this.z, 0, width, 16, 0);
  ellipse(sx, sy, r, r);

  var px = map(this.x / this.zp, 0, 1, 0, width);
  var py = map(this.y / this.zp, 0, 1, 0, height);

  this.zp = this.z; //resetting

  stroke(255, 0, 0, 70);
  line(px, py, sx, sy);
 }
}

/* Particles for the radiation was inspired by daniel shiffman: https://www.youtube.com/watch?v=17WoOqgXsRM
I have changed the style and adjusted the code so it works well with my animation and so that it does not
change accroding to mouse movements */
