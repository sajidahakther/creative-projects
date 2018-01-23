/*

Put your creative rationale in a comment here. 

 - What effect were you trying to achieve ?
 I was trying to create two ongoing ellipses that continously spiral and change shape overtime,
 with one set of ellipses overlapping the other set so that the two different colour sets could layer and create a 3D effect.
 I also wanted to add some noise to create texture to the background, so that overall there are layers of pattern all moving in uniform.
 
 - How does your code do this ?
 The way I have made my ellipses ongoing is by first creating a for loop where i have set a life of 50 ellipses and then 
 incemented the variables 'i'. Then I set these variables as the parameters of my ellipse. For the 3rd and 4th parameter 
 I have multiplied 'i' with a number and this controls the width and height of the ellipses so I adjusted the number until I
 found a size that best worked and formed a nice pattern when it was being looped.
 In between, I have used the rotate function, and input the parameter of 'spiral' which has a default value of 0, 
 however, before I begin my loop, I declare that the spiral variable will increase by every frame, specifically by 0.009.
 spiral = spiral + 0.009 (+=)
 
 I then created background noise, set it to blue, with a random width/height distribution that has a life of 500.
 I decided to use blue because it is a more subtle colour that can blend in with the background, and this also allows my 
 coloured ellipse spirals to be the main focus. Above this layer, I have created white noise within a circle vector. 
 I made it white so that it could stand out in between the ellipses, and give the impression of particles coming out of the
 spirals and moving around along with the ellipses.

 - What are you happy with ? What could be improved ?
 I like the way the different shapes form from the spirals overtime, the form keeps on changing and I like how the lines and points are
 structured and the layered effect that I was able achieve from this. I think it could be improved by adding some more layers, and creating
 something more interesting using noise for my background, for example, a more complex shape.

*/


var spiral = 0;

function setup() {
 createCanvas(512, 512);
 noFill();
}

function draw() {
 background(0);

 // Background noise, set to blue, with a random width/height distribution that has a life of 500.
 for (var i = 0; i < 200; i++) {
  stroke(0, 0, 197)
  strokeWeight(1);
  var x = random(0, width);
  var y = random(0, height);
  point(x, y);
 }

 // Translating everything in the centre.
 translate(width / 2, height / 2);

 // Circle noise, set to white, with a random distribution within the circle vector that has been creating using the cos and sine angle.
 for (i = 0; i < 50; i++) {
  stroke(255);
  strokeWeight(1);
  var dist = max(random(0.0, 1.0), random(0.0, 1.0)) * width / 2.5;
  var angle = random(0, PI * 2);
  var p = createVector(cos(angle), sin(angle));
  p.mult(dist);
  point(p.x, p.y);
 }

 spiral += 0.0009; // Spiral variable increases by 0.0009 every frame (+=)
 for (i = 0; i < 50; i++) {
  stroke(85, 26, 139); // Purple
  strokeWeight(0.4);
  rotate(spiral);
  ellipse(i, i, i * 3, i * 6);
 }

 for (i = 0; i < 50; i++) {
  stroke(255, 116, 0); // Orange
  strokeWeight(0.3);
  rotate(spiral);
  ellipse(i, i, i * 6, i * 3);
 }

}