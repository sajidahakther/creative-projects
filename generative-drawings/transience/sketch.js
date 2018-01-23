function setup() {
 createCanvas(windowWidth, windowHeight);
 rectMode(CENTER);
 fill(255, 20);
 stroke(204, 0, 82, 50);
}

function draw() {
 background(102, 0, 41, 0); //try 10 as alpha 

 //ANGLES
 var a1 = TWO_PI * noise(0.01 * frameCount + 10);
 var a2 = TWO_PI * noise(0.01 * frameCount + 20);
 var a3 = TWO_PI * noise(0.01 * frameCount + 30);

 //X CO-ORDINATE
 var x1 = 60 * noise(0.01 * frameCount + 40);
 var x2 = 200 * noise(0.01 * frameCount + 50);

 //SIZE OF SHAPE
 var s1 = 200 * noise(0.01 * frameCount + 60);
 var s2 = 50 * noise(0.01 * frameCount + 60);

 translate(width / 2, height / 2);
 for (var i = 0; i < 18; i++) {
  push();
  rotate(a1 + TWO_PI * i / 18);
  translate(x2, 0);
  rect(0, 0, s1, s1); //multiply s1 by amp 
  for (var j = 0; j < 16; j++) {
   push();
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