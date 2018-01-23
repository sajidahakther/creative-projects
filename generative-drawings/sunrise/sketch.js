function setup() {
 createCanvas(windowWidth, windowHeight);
}

function draw() {
 background(255);

 //ANGLES that rotate with perlin noise
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

 for (var i = 0; i < 30; i++) {
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
   rect(x1, 0, s2, s2);
   pop();
  }
  translate()
  pop();
 }

}