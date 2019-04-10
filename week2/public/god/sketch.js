// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */

let video;
let cnv;
let start = false;
let startOver;

// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

//socket info
// Open and connect player
let socket = io('/god');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

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

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvasContainer');

  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
  startOver = createButton('start world over')
    .mousePressed(function(){
      bloom();
    });

  //socket events

  // Listen for message
  // socket.on('message', function (message) {
  //   let id = message.id;
  //   let data = message.data;
  // }

  //starting stuff
  bloom();
}

function draw() {
  if (start) {
    background(0);
    for (let f = food.length - 1; f >= 0; f--) {
      if (food.supply <= 0) {
        food.splice(f, 1);
      } else {
        food[f].show();
      }
    }
    for (let i = godlings.length - 1; i >= 0; i--) {
      godlings[i].move();
      // godlings[i].collide(i);
      godlings[i].show();
    }
    for (let i = godlings.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (godlings[i].intersects(godlings[j])) {
          godlings[i].loveAndHate(godlings[j]);
        }
      }
      for (let f of food){
        if (godlings[i].intersects(f)){
          f.supply--;
          if(godlings[i].hunger < godHunger){
            godlings[i].hunger += 50;
          }
        }
      }
      //check for death
      if (godlings[i].dead) {
        godlings.splice(i, 1);
      }
    }
    let world = {
      godlings: godlings,
      food: food
    }
    console.log(world);
    socket.emit('data', world);
  }
}

function bloom(){
  //starting godlings
  for (let i = 0; i < 10; i++) {
    let randStart = random(-200, 200);
    let godling = new Godling(width / 2 + randStart, height / 2 + randStart);
    godlings.push(godling);
    //starting Food
    let startFood = new Food();
    food.push(startFood);
  }
}


/*
-------------- KNN Functions
*/

function modelReady() {
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateExampleCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of classes from knnClassifier
  const numClasses = knnClassifier.getNumClasses();
  if (numClasses <= 0) {
    console.error('There is no examples in any class');
    return;
  }
  if (!start) {
    start = true;
    socket.emit('start');
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which class do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the button is pressed, add the current frame
  // from the video with a label to the classifier
  buttonSmite = select('#addSmite')
    .mousePressed(function() {
      addExample('Smite');
    });

  buttonFertilize = select('#addFertilize')
    .mousePressed(function() {
      addExample('Fertilize');
    });

  buttonFood = select('#addFood')
    .mousePressed(function() {
      addExample('Food');
    });

  buttonHope = select('#addHope')
    .mousePressed(function() {
      addExample('Hope');
    });

  buttonJoy = select('#addJoy')
    .mousePressed(function() {
      addExample('Joy');
    });

  // Reset buttons
  resetSmite = select('#resetSmite')
    .mousePressed(function() {
      clearClass('Smite');
    });

  resetFertilize = select('#resetFertilize')
    .mousePressed(function() {
      clearClass('Fertilize');
    });

  resetFood = select('#resetFood')
    .mousePressed(function() {
      clearClass('Food');
    });

  resetHope = select('#resetHope')
    .mousePressed(function() {
      clearClass('Hope');
    });

  resetJoy = select('#resetJoy')
    .mousePressed(function() {
      clearClass('Joy');
    });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllClasses);

  // // Load saved classifier dataset
  // buttonSetData = select('#load');
  // buttonSetData.mousePressed(loadDataset);

  // Get classifier dataset
  // buttonGetData = select('#save');
  // buttonGetData.mousePressed(saveDataset);
}

// Show the results
function gotResults(err, result) { //prob where the action happens
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confideces = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confideces[result.label] * 100} %`);
    }

    if (result.label == 'Smite') {

    }
    if (result.label == 'Fertilize') {
      let babyMaker = random(godlings);
      babyMaker.fertility = true;
    }
    if (result.label == 'Food') {
      let newFood = new Food();
      food.push(newFood);
    }
    if (result.label == 'Hope') {
      for (let g of godlings) {
        g.hope += 50;
        g.hope = constrain(g.hope, 0, godHope);
      }
    }
    if (result.label == 'Joy') {
      for (let g of godlings) {
        g.joy += 50;
        g.joy = constrain(g.joy, 0, godJoy);
      }
    }

    select('#confidenceSmite').html(`${confideces['Smite'] ? confideces['Smite'] * 100 : 0} %`);
    select('#confidenceFertilize').html(`${confideces['Fertilize'] ? confideces['Fertilize'] * 100 : 0} %`);
    select('#confidenceFood').html(`${confideces['Food'] ? confideces['Food'] * 100 : 0} %`);
    select('#confidenceHope').html(`${confideces['Hope'] ? confideces['Hope'] * 100 : 0} %`);
    select('#confidenceJoy').html(`${confideces['Joy'] ? confideces['Joy'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each class
function updateExampleCounts() {
  const counts = knnClassifier.getClassExampleCountByLabel();

  select('#exampleSmite').html(counts['Smite'] || 0);
  select('#exampleFertilize').html(counts['Fertilize'] || 0);
  select('#exampleFood').html(counts['Food'] || 0);
  select('#exampleHope').html(counts['Hope'] || 0);
  select('#exampleJoy').html(counts['Joy'] || 0);

}

// Clear the examples in one class
function clearClass(classLabel) {
  knnClassifier.clearClass(classLabel);
  updateExampleCounts();
}

// Clear all the examples in all classes
function clearAllClasses() {
  knnClassifier.clearAllClasses();
  updateExampleCounts();
}

//no save or load in this example
/*
// Save dataset as myKNNDataset.json
function saveDataset() {
  knnClassifier.saveDataset('myKNNDataset');
}

// Load dataset to the classifier
function loadDataset() {
  knnClassifier.loadDataset('./myKNNDataset.json', updateExampleCounts);
}
*/
