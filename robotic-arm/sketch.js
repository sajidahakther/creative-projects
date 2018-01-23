var fingerSizes = [
 [50, 160, 50],
 [50, 200, 50],
 [50, 240, 50],
 [50, 200, 50],
 [50, 140, 50]
];
var palmSize = [240, 200, 50];
var armSize = [170, 300, 50];
var fingerSpacing = 63;
var maxAngle = 60;

function setup() {
 createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
 background(255);
 translate(0, 0, -500);

 //Changed colour, and created directional lighting dependant on mouse movement.
 var locY = (mouseY / height - 0.5) * (-2);
 var locX = (mouseX / width - 0.5) * 2;
 directionalLight(200, 0, 0, 0.25, 0.25, 0.25);
 pointLight(200, 0, 100, locX, locY, 0);
 pointLight(200, 150, 50, -locX, -locY, 0);

 //Creating the ARM and setting the rotated movements:
 rotateY(sin(frameCount / 100));
 rotateZ(sin(frameCount / 100));
 push();
 translate(0, 150, 0);
 arm(armSize[0], armSize[1], armSize[2]);
 pop();

 //Palm:
 var mainPhase = (sin(frameCount / 10) + 1) / 2;
 palm(palmSize[0], palmSize[1], palmSize[2], mainPhase);

 //Fingers:
 translate(-palmSize[0] / 2 + fingerSizes[0][0] / 2, -palmSize[1] / 2, (sin(frameCount / 10) + 1) / 2);
 for (var i = 1; i < 5; i++) {
  push();
  var eachPhase = PI / 5;
  var differentPhases = (sin(frameCount / 10 - eachPhase * i) + 1) / 2;
  //console.log(differentPhases);
  finger(fingerSizes[i][0], fingerSizes[i][1], fingerSizes[i][2], differentPhases);
  pop();
  translate(fingerSpacing, 0, 0);
 }

 //Thumb:
 translate(-palmSize[1] - 80, palmSize[1] / 2, 0);
 rotateZ(radians(90)); //Moves the thumb inwards horizontally
 finger(fingerSizes[4][0], fingerSizes[4][1], fingerSizes[4][2], mainPhase);
}

//Arm:
function arm(w, h, d) {
 box(w, h, d);
}

//Palm:
function palm(w, h, d, bend) {
 rotateX(radians(maxAngle * bend)); //Makes the palm bend forwards and straight
 translate(0, -h / 2, 0);
 box(w, h, d);
}

//Creating the PHALANX BONES of the finger:
function phalanx(w, h, d, bend) {
 rotateX(radians(maxAngle * bend)); //Bends the phalanges in and out like a goodbye wave.
 translate(0, -h / 2, 0); //Locates the phalanges
 box(w, h, d);
}

function finger(w, h, d, bend) {
 // 1 ) Proximal Phalange:
 sphere(20);
 phalanx(w, h * 0.35, d, bend);
 // 2 ) Intermediate Phalange:
 translate(0, -h * 0.37 / 2, 0);
 sphere(20);
 phalanx(w, h * 0.37, d, bend);
 // 3 ) Distal Phalange:
 translate(0, -h * 0.35 / 2, 0);
 sphere(20);
 phalanx(w, h * 0.35, d, bend);
}
