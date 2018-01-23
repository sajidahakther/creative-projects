var envF = new maximEx.envFollower();
var samplePlayer = new maximJs.maxiSample();
var amp;

function setup() {
 createCanvas(windowWidth, windowHeight);
 rectMode(CENTER);
 fill(255, 20);
 stroke(50, 50);

 //AUDIO INPUT
 audio = new maximJs.maxiAudio();
 audio.play = playLoop;
 audio.init();
 audio.loadSample("assets/lasers.mp3", samplePlayer);
}

function playLoop() {
 var sig = samplePlayer.play();
 amp = envF.analyse(sig, 0.01, 0.5);
 this.output = sig;
}

function draw() {
 background(50, 0);

 //ANGLES
 //Multiplying a circle by noise which is a random sequence generator, and i have multiplied this by the framecount
 //which is constantly increasing so therefore it changes.
 var a1 = TWO_PI * noise(0.01 * frameCount + 10);
 var a2 = TWO_PI * noise(0.01 * frameCount + 20);
 var a3 = TWO_PI * noise(0.01 * frameCount + 30);

 //X CO-ORDINATE
 //Creating variables that control how the ellipses move along the x axis.
 var x1 = 60 * noise(0.01 * frameCount + 40);
 var x2 = 200 * noise(0.01 * frameCount + 50);


 //SIZE OF SHAPE
 //Creating variables that control the size of the shape, making it change in a random sequence multiplied by the framecount and the amplitude.
 var sound = amp / 2;
 var s1 = 200 * noise(0.01 * frameCount + 10 * sound);
 var s2 = 50 * noise(0.01 * frameCount + 10 * sound);

 translate(width / 2, height / 2);
 for (var i = 0; i < 18; i++) {
  push();
  stroke(206,0,73, 60); //Pink
  rotate(a1 + TWO_PI * i / 18);
  translate(x2, 0);
  rect(0, 0, s1, s1);
  for (var j = 0; j < 16; j++) {
   push();
   stroke(251,88,0, 60); //Orange
   rotate(a2 + TWO_PI * j / 16);
   translate(x1, 0);
   rotate(a3);
   ellipse(x1, 0, s2, s2);
   pop();
  }
  translate()
  pop();
 }
}
