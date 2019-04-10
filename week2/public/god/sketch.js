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

// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

//socket info
// Open and connect player
let socket = io('/god');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

//godling variables
let godSpeed = 5;
let godHunger = 1000; //bigger b/c decreases by 1 each frame?
let godHope = 1000;
let godJoy = 1000;
let godDespair = 10; //limit for killing
let godFertility = false;
let godSize = 50;
let godUpDown = [1, -1];
let godLeftRight = [-1, 1];

let godlings = [];

class Godling {//need high up b/c not hoisted?
  constructor(x, y){ //spawns where the collision took place
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
  move(){ //move the godlings in a random direction until they hit a wall
    this.hope = constrain(this.hope, 0, godHope);
    this.speed = map(this.hope, 1, godHope, 0, godSpeed);
    if(this.x < 0 || this.x > width){
      this.left *= -1;
    }
    if(this.y < 0 || this.y > height){
      this.up *= -1;
    }
    //this is gonna be weird, add? do something else? -- inital direction?
    this.x += ((this.speed * this.xSpeed)/2) * this.left;
    this.y += ((this.speed * this.ySpeed)/2) * this.up;

    //if food


  }
  show(){ //update the display
    //slight decline
    this.joy--;
    this.hope--;
    // this.hunger--;
    //if fertile, highlight in white
    if(this.dead){
      godlings.splice(this, 1);
      return;
    }
    if(this.fertility){
      stroke(255,255,255);
      strokeWeight(3);
    } else {
      noStroke();
    }
    //if joyous, green, if suffering, red
    let joyColor = map(this.joy, 1, godJoy, 0, 255);
    let sufferColor = 255 - joyColor;
    fill(sufferColor, joyColor, 20);
    //hungry, decreases in size
    this.size = map(this.hunger, 1, godHunger, 5, 50);
    //show
    ellipse(this.x, this.y, this.size, this.size);
  }
  eat(){

  }
  spawn(){ //if two fertile godlings hit, they pop out a new one

  }
  kill(){ //if a suffering godling hits another godling, that godling dies

  }

  intersects(other){
    //return true if they're touching
    return ((dist(this.x, this.y, other.x, other.y)) < (this.size + other.size));
    // let sharedSpace = this.size + other.size; //too much computing?
    // if (dist(this.x, this.y, other.x, other.y) < sharedSpace){
    //   return ;
    // }
  }

  loveAndHate(other){
    if(this.fertility && other.fertility){ //if both fertile, make a baby
      let baby = new Godling(this.x, other.y);
      godlings.push(baby); //pushhhh!!!
      this.fertility = false; //turn off or will make two?
      other.fertility = false;
    }
    // let thisDead = false;
    // let jDead = false;
    if(this.joy < godDespair){ //if i is despairing
      console.log("them dead" + this.joy + " X " + other.joy);
      other.dead = true;
    }
    if(other.joy < godDespair){ //if j is despairing
      console.log("this dead" + this.joy + " X " + other.joy);
      other.dead = true;
    }
  }
/*
  collide(){
    // if lover or enemy
    // console.log(this);
    for (let j = godlings.length -1; j >= 0; j--){
      let them = godlings[j];
      if (them !== this){
        let sharedSpace = this.size + them.size; //too much computing?
        if (dist(this.x, this.y, them.x, them.y) < sharedSpace){
          // console.log('hit' + this + them);
          // console.log(this);
          if(this.fertility && them.fertility){ //if both fertile, make a baby
            let baby = new Godling(this.x, them.y);
            godlings.push(baby); //pushhhh!!!
            this.fertility = false; //turn off or will make two?
            them.fertility = false;
          }
          // let thisDead = false;
          // let jDead = false;
          if(this.joy < godDespair){ //if i is despairing
            console.log("them dead" + this.joy + " X " + them.joy);
            them.dead = true;
          }
          if(them.joy < godDespair){ //if j is despairing
            console.log("this dead" + this.joy + " X " + them.joy);
            this.dead = true;
          }
          //if either was killed

          // if(thisDead){
          //   godlings.splice(i, 1);
          //   if(jDead){ //have to mess with index because of splice...
          //     if(i < j){
          //       godlings.splice(j-1, 1);
          //     } else{
          //       godlings.splice(j, 1);
          //     }
          //   }
          // } else if (jDead){
          //   godlings.splice(j, 1);
          // }

        }
      }
    }
  }
*/

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

  //socket events

  // Listen for message
  // socket.on('message', function (message) {
  //   let id = message.id;
  //   let data = message.data;
  // }

  //starting godlings
  for (let i = 0; i < 10; i ++){
    let randStart = random(-200, 200);
    let godling = new Godling(width/2 + randStart, height/2 + randStart);
    godlings.push(godling);
  }
}

function draw(){
  if(start){
    background(0);
    for (let i = godlings.length - 1; i >= 0; i--){
      godlings[i].move();
      // godlings[i].collide(i);
      godlings[i].show();
    }
    for (let i = godlings.length - 1; i >= 0; i--){
      for (let j = i -1; j >= 0; j--){
        if (godlings[i].intersects(godlings[j])){
          godlings[i].loveAndHate(godlings[j]);
        }
      }
      //check for death
      if (godlings[i].dead){
        godlings.splice(i, 1);
      }
    }
  }
}

/*
-------------- p5 stuff
*/



/*
-------------- KNN Functions
*/

function modelReady(){
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
  if (!start){
    start = true;
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

    if (result.label == 'Smite'){

    }
    if (result.label == 'Fertilize'){
      let babyMaker = random(godlings);
      babyMaker.fertility = true;
    }
    if (result.label == 'Food'){

    }
    if (result.label == 'Hope'){
      for (let g of godlings){
        g.hope += 50;
        g.hope = constrain(g.hope, 0, godHope);
      }
    }
    if (result.label == 'Joy'){
      for (let g of godlings){
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
