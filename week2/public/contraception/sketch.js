// Open and connect player
let socket = io('/contraception');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

let condom;
let start = false;

//godling variables
let godSpeed = 5;
let godHunger = 5000; //bigger b/c decreases by 1 each frame?
let godHope = 1000;
let godJoy = 1000;
let godDespair = 10; //limit for killing
let godFertility = false;
let godSize = 50;
let godUpDown = [1, -1];
let godLeftRight = [-1, 1];
let godlings = [];
let food = [];

function preload(){
  condom = loadImage('../assets/condom.png');
}

class Food {
  constructor() {
    this.x = random(10, width - 10);
    this.y = random(10, height - 10);
    this.size = random(10, 40);
    this.supply = int(random(10, 500));
  }
  munch() {
    this.supply--;
  }
  show() {
    noStroke();
    fill(0, 100, 255);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Godling { //need high up b/c not hoisted?
  constructor(x, y) { //spawns where the collision took place
    this.x = x;
    this.y = y;
    this.xSpeed = random(1, godSpeed);
    this.ySpeed = random(1, godSpeed);
    this.up = random(godUpDown);
    this.left = random(godLeftRight);
    this.size = random(10, godSize);
    // this.speed = random(1, godSpeed);
    this.fertility = godFertility;
    this.hunger = random(1, godHunger);
    this.hope = random(1, godHope);
    this.joy = random(1, godJoy);
    this.dead = false; //weird splice issue
  }
  move() { //move the godlings in a random direction until they hit a wall
    this.hope = constrain(this.hope, 0, godHope);
    this.speed = map(this.hope, 1, godHope, 0, godSpeed);
    if (this.x < 0 || this.x > width) {
      this.left *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.up *= -1;
    }
    //this is gonna be weird, add? do something else? -- inital direction?
    this.x += ((this.speed * this.xSpeed) / 2) * this.left;
    this.y += ((this.speed * this.ySpeed) / 2) * this.up;

    //if food


  }
  show() { //update the display
    //slight decline
    this.joy--;
    this.hope--;
    this.hunger--;
    //hungry, decreases in size
    if (this.hunger <= 0){
      this.dead = true;
    }
    this.size = map(this.hunger, 0, godHunger, 5, 50);
    //if dead, kill it
    if (this.dead) {
      godlings.splice(this, 1);
      return;
    }
    //if fertile, highlight in white
    if (this.fertility) {
      stroke(255, 255, 255);
      strokeWeight(3);
    } else {
      noStroke();
    }
    //if joyous, green, if suffering, red
    let joyColor = map(this.joy, 1, godJoy, 0, 255);
    let sufferColor = 255 - joyColor;
    fill(sufferColor, joyColor, 20);

    //show
    ellipse(this.x, this.y, this.size, this.size);
  }
  eat() {

  }
  spawn() { //if two fertile godlings hit, they pop out a new one

  }
  kill() { //if a suffering godling hits another godling, that godling dies

  }

  intersects(other) {
    //return true if they're touching
    return ((dist(this.x, this.y, other.x, other.y)) < (this.size + other.size));
    // let sharedSpace = this.size + other.size; //too much computing?
    // if (dist(this.x, this.y, other.x, other.y) < sharedSpace){
    //   return ;
    // }
  }

  loveAndHate(other) {
    if (this.fertility && other.fertility) { //if both fertile, make a baby
      let baby = new Godling(this.x, other.y);
      godlings.push(baby); //pushhhh!!!
      this.fertility = false; //turn off or will make two?
      other.fertility = false;
    }
    // let thisDead = false;
    // let jDead = false;
    if (this.joy < godDespair) { //if i is despairing
      console.log("them dead" + this.joy + " X " + other.joy);
      other.dead = true;
    }
    if (other.joy < godDespair) { //if j is despairing
      console.log("this dead" + this.joy + " X " + other.joy);
      other.dead = true;
    }
  }
}


//sockets on in here so that I don't get data before I'm ready to use them
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  socket.on('start', function(){
    start = true;
  });
  // Listen for message
  socket.on('update', function (world) {
    console.log('got it');
    godlings = world.godlings;
    food = world.food;
  });

}


function draw() {
  if (start) {
    background(0);
    for (let f = food.length - 1; f >= 0; f--) {
      noStroke();
      fill(0, 100, 255);
      rect(food[f].x, food[f].y, food[f].size, food[f].size);
    }
    for (let i = godlings.length - 1; i >= 0; i--) {
      let dog = godlings[i];
      // godlings[i].move();
      // godlings[i].show();
      //if fertile, highlight in white
      if (dog.fertility) {
        stroke(255, 255, 255);
        strokeWeight(3);
      } else {
        noStroke();
      }
      //if joyous, green, if suffering, red
      let joyColor = map(dog.joy, 1, godJoy, 0, 255);
      let sufferColor = 255 - joyColor;
      fill(sufferColor, joyColor, 20);

      //show
      ellipse(dog.x, dog.y, dog.size, dog.size);
    }
    image(condom, mouseX, mouseY, 70, 70);
    let conPos = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('condom', conPos);
  }
}
