var video;
var binning = true;
var modesSlider;
var pixelSizeSlider;
var backgroundColourSlider;

function setup() {
 createCanvas(640, 480);

 video = createCapture(VIDEO);
  video.size(640, 480);
 video.hide();

 frameRate(1);
 noStroke();

 modesSlider = createSlider(0, 2, 0);
 backgroundColourSlider = createSlider(0, 255, 0); //creating a slider to change the colour of the background
 pixelSizeSlider = createSlider(10, 30, 10);
}

function draw() {

 //pixel size: Created a slider that controls the size of the bins and the pixel shape drawn
 var pixelWidth = pixelSizeSlider.value();
 var pixelHeight = pixelSizeSlider.value();

 background(backgroundColourSlider.value()); //setting the background to the value of the slider, default being 50.
 video.loadPixels();

 var tot = pixelWidth * pixelHeight;
 for (var x = 0; x < video.width; x += pixelWidth) {  //taking up the full width and height of the video
  for (var y = 0; y < video.height; y += pixelHeight) {
   var index = (i + (j * video.width)) * 4;
   var red = 0,
    green = 0,
    blue = 0;

   if (binning) { //this will collect adjacent CCD pixels inorder to reduce the noise therefore, improves the signal-to-noise ratio on the webcam
    for (var i = 0; i < pixelWidth; i++) {
     for (var j = 0; j < pixelHeight; j++) {
       index = ((x + i) + ((y + j) * video.width)) * 4;
      red += video.pixels[index + 0];
      green += video.pixels[index + 1];
      blue += video.pixels[index + 2];
     }
    }
    var c = color(red / tot, green / tot, blue / tot);

   } else { //when the mouse is clicked again, binning is stopped as it is set back to the original
    index = (x + (y * video.width)) * 4;
    red = video.pixels[index + 0];
    green = video.pixels[index + 1];
    blue = video.pixels[index + 2];
    c = color(red, green, blue);
   }

   var modes = [c, replace8bit(c), replace4bit(c)]; // array consisting of each bit mode
   var bits = modesSlider.value(); // setting this to the slider value so that the user can switch between each bit mode
   fill(modes[bits]); // setting the fill to the values listed in the array so that it replaces each of these bits
   ellipse(x, y, pixelWidth, pixelHeight); //setting shape, size of the pixel

  }
 }

  //creating instructions
 rectMode(CENTER);
 fill(0);
  rect(75, height / 2 + 130, 110, 50); //bg of pixel bining text
 rect(100, height / 2 + 200, 160, 70); //bg of slider text
 fill(255);
 instructions = "MOUSE CLICK:    PIXEL BINNING";
 text(instructions, 80, height / 2 + 165, 100, 100);
 slidertext = "SLIDER 1: MODES SLIDER 2: BG COLOUR SLIDER 3: PIXEL SIZE";
 text(slidertext, 100, height / 2 + 230, 150, 100);
}

//8 bit mode

function replace8bit(c) {

 var r = int(red(c) / (255 / 8)) * (255 / 8); //red encodes 8 shades
 var g = int(green(c) / (255 / 8)) * (255 / 8); //green encodes 8 shades
 var b = int(blue(c) / (255 / 4)) * (255 / 4); //blue encodes 4 shades

 return color(r, g, b);
}

// 4 bit mode

function replace4bit(c) {

 var colours = [
  color("#000000"), //black
  color("#555555"), // gray
  color("#0000AA"), // blue
  color("#5555FF"), // light blue
  color("#00AA00"), // green
  color("#55FF55"), // light green
  color("#00AAAA"), // cyan
  color("#55FFFF"), // light cyan
  color("#AA0000"), // red
  color("#FF5555"), // light red
  color("#AA00AA"), // magenta
  color("#FF55FF"), // light magenta
  color(170, 85, 0), // brown // #AA5500
  color("#FFFF55"), // yellow
  color("#AAAAAA"), // light gray
  color("#FFFFFF") // white (high intensity)
 ];

 var dist = [];

 for (var i = 0; i < colours.length; i++) { //looping through all the colours in the array

  var r2 = red(c);
  var g2 = green(c);
  var b2 = blue(c);

  //gets the colours from the array
  var r1 = red(colours[i]);
  var g1 = green(colours[i]);
  var b1 = blue(colours[i]);

  var d = pow(r2 - r1, 2) + pow(g2 - g1, 2) + pow(b2 - b1, 2); //euclidian equation to find the distance between two points
  dist.push(d);
 }

 var min = dist.reduce(function(a, b) {
  if (a < b) {
   return a;
  } else {
   return b;
  }
 });

 for (i = 0; i < colours.length; i++) {
  if (dist[i] === min) {
   return colours[i]; //returning the colour value
  }
 }
}

function keyPressed() {
 if (keyCode === UP_ARROW) {
  //red tint mode
  tint(255, 0, 0);
 image(video, 0, 0);

 }

 if (keyCode === DOWN_ARROW) {
  //blue tint mode
   tint(0, 0, 255);
 image(video, 0, 0);
 }
}


function mousePressed() {
 binning = !binning; // because binning is already set to true, when mouse is clicked, video binning stops. Mouse clicked again = video binning activated.
}
