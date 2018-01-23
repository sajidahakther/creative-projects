var cells = [];

function setup() {
 createCanvas(900, 600);
 cells.push(new Cell(2));
 cells.push(new Cell(6));

 // Pushing 10 cells onto the cells array with a random mass between 1 and 3.
 for (var i = 0; i < 10; i++) {
  cells.push(new Cell(random(1, 3)));
 }
}

function draw() {
 background(0);

 // Cells move away from the mouse, and scatter from all directions when mouse is pressed.
 for (var i = 0; i < cells.length; i++) {
  if (mouseIsPressed) {
   var mouse = createVector(mouseX, mouseY);
   var scatter = p5.Vector.sub(cells[i].loc, mouse);
   scatter.normalize();
   scatter.setMag(0.3);
   cells[i].applyForce(scatter);
  }

  /* Setting the friction and turning the friction to a force with the magnitude of 0.03
  because a higher friction relfects the movement of organisms in a petri dish. */
  var friction = cells[i].speed.copy();
  friction.mult(-1);
  friction.normalize();
  friction.mult(0.03);
  cells[i].applyForce(friction);
  cells[i].run();
 }

}

function Cell(_m, _loc) {

 this.speed = createVector(random(-1, 1), random(-1, 1));
 this.loc = _loc || createVector(random(width), height / 2);
 this.acceleration = createVector(0, 0);
 this.mass = _m || 4;
 this.diam = this.mass * 10;
 this.maxMass = 6
 this.agingRate = random(0.003, 0.015);
 this.intersects = false;

 this.draw = function() {
  this.diam = this.mass * 10;
  fill(88, 72, 78);
  noStroke();
  ellipse(this.loc.x, this.loc.y, this.diam, this.diam);
 }

 this.move = function() {
  this.speed.add(this.acceleration);
  this.loc.add(this.speed);
  this.acceleration.mult(0);
 }

 this.borders = function() {
  if (this.loc.x > width - this.diam / 2) {
   this.loc.x = width - this.diam / 2;
   this.speed.x *= -1;
  } else if (this.loc.x < this.diam / 2) {
   this.speed.x *= -1;
   this.loc.x = this.diam / 2;
  }
  if (this.loc.y > height - this.diam / 2) {
   this.speed.y *= -1;
   this.loc.y = height - this.diam / 2;
  } else if (this.loc.y < this.diam / 2) {
   this.speed.y *= -1;
   this.loc.y = this.diam / 2;
  }
 }

 // CHECKING COLLISIONS BETWEEN CELLS:
 this.checkCollisions = function() {
   this.intersects = false; // Resets the intersects variable to false.

  /* Looping through the cells array and taking into account the distance between the
  location of each cell as well as the diameters of each cell and when both cells have
  collided, setting the intersects variable to true. */
  for (var i = 0; i < cells.length; i++) {

   var cellLocs = dist(this.loc.x, this.loc.y, cells[i].loc.x, cells[i].loc.y);
   var cellDiam = cells[i].diam / 2 + this.diam / 2;

   if (cellLocs < cellDiam) {
    if (cellLocs === 0) {} else {
     this.intersects = true;

     noStroke();
     fill(random(0, 100), 0, random(0, 100));
     ellipse(this.loc.x, this.loc.y, this.diam, this.diam);

     /* Creating a force of the correct direction and setting the magnitude of
     the force to 0.8 to affect the "springiness" of the cells. Applying it on
     THIS inorder to make it bounce away when the cells intersect. */
     var repel = p5.Vector.sub(cells[i].loc, this.loc);
     repel.normalize();
     repel.mult(-1);
     repel.setMag(0.8);
     this.applyForce(repel);
    }
   }

  }
 }

 // CELL AGING & MITOSIS:
 this.aging = function() {
  this.mass += this.agingRate; // Incrementing the mass
  var chanceOf = random(1, 100); // Chance out of 100%

  /* If the mass of the cell reaches the maximum mass, the parent dies without spawning children
  (splicing cell) and it has a 55% chance of two small cells being pushed out - mitosis takes place. */
  if (this.mass > this.maxMass) {
   cells.splice(cells.indexOf(this), 1);
   if (chanceOf < 55) {
    cells.push(this.mitosis());
    cells.push(this.mitosis());
   }
  }
 }

 this.mitosis = function() {
  var newLoc = this.loc.copy();
  var tempCell = new Cell(this.mass / 3, newLoc);
  return tempCell;
 }

 this.applyForce = function(f) {
  var adjustedForce = f.copy();
  adjustedForce.div(this.mass);
  this.acceleration.add(adjustedForce);
 }

 this.run = function() {
  this.draw();
  this.move();
  this.borders();
  this.checkCollisions();
  this.aging();
  this.mitosis();
 }

}
