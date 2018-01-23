var envF = new maximEx.envFollower();
var samplePlayer = new maximJs.maxiSample();
var amp;
var rSlider, gSlider, bSlider;
var l = 0;

function setup() {
 createCanvas(windowWidth, windowHeight);

 //AUDIO INPUT
 audio = new maximJs.maxiAudio();
 audio.play = playLoop;
 audio.init();
 audio.loadSample("assets/4.wav", samplePlayer);

 //SLIDER: to adjust the colour of the strokes
 rSlider = createSlider(0, 200, 150);
 rSlider.position(20, 20);
 gSlider = createSlider(0, 200, 0);
 gSlider.position(20, 50);
 bSlider = createSlider(0, 200, 128);
 bSlider.position(20, 80);
}

function playLoop() {
 var sig = samplePlayer.play();
 amp = envF.analyse(sig, 0.01, 0.5);
 this.output = sig;
}

function draw() {
 var d = amp * 50;
 var r = rSlider.value();
 var g = gSlider.value();
 var b = bSlider.value();

 /* CONTROLS THE COLOUR OF THE LINES: RGBA
 By multiplying the rgb values by l and then setting the values to modulo 255, the stroke picks up each
 individual rgb and is able to display the multicolours on screen instead of just one solid colour. */

 stroke(l * r % 255, l * g % 255, l * b % 255, 40);

 /* LINE SET 1: Top left corner
 The x co-ordinate of the first point is l incremented and shifts to the right taking up the width of the window
 modulo the amplitude, the y co-ordinate of the first point is 0. The x co-ordinate of the second point is l incremented
 modulo the width of the window and multiplied by the amp. The y co-ordinate of the second point is the width of the window.
 For the second line, i swapped the first point and the second point values around, so that they can be reflective. */

 if (d > 10) { //if the amp is more than 10, draw these lines
  line((l++ >> width) % d, 0, l++ % width * d, width);
  line(0, (l++ << width) % d, width, l++ % width * d);
 }

 /* LINE SET 2: Bottom right corner
 The x co-ordinate of the first point is l incremented and shifting left towards the height and this all being modulo
 the amplitude. The y co-oridinate of the first point is the height. The x co-ordinate of the second point is l incremented
 modulo height and multiplied by the amplitude. The y co-ordinate of the second point is 0. For the second line, swapped the
 first point and the second point values around, so that they can be reflective and also changed height to wdith. */

 line((l++ << height) % d, height, l++ % height * d, 0);
 line(width, (l++ >> width) % d, 0, l++ % height * d);

 //DISPLAYING THE SLIDER ON SCREEN
 noStroke();
 push();
 fill(255, 1);
 rect(10, 10, 200, 100)
 pop();
 fill(0,10);
 noStroke();
 text("Red", rSlider.x * 2 + rSlider.width, 35);
 text("Green", gSlider.x * 2 + gSlider.width, 65);
 text("Blue", bSlider.x * 2 + bSlider.width, 95);

}
