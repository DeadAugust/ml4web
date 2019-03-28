let video;
let classifier;

function setup(){
  // noCanvas();
  video = createCapture(VIDEO);
  createCanvas(500,500);
  background(0,255,200);

  //set up image classifier with MobileNet and the video
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}

function draw(){

}

function modelReady(){
  //change status of model when ready
  select('#status').html('Model Loaded');
  //call the function to start classifying the VIDEO
  classifyVideo();
}

//makes prediction
function classifyVideo(){
  classifier.predict(gotResult);
}

//result
function gotResult(err, results){
  //array ordered by prob.
  select('#result').html(results[0].className);
  select('#probability').html(nf(results[0].probability, 0, 2));

  if (results[0].className == 'water bottle'){
    let randX = random(0, 500);
    let randY = random(0, 500);
    let randD = random(0, 500);
    let randC = random(0, 255);
    fill(0, 0, randC);
    ellipse(randX, randY, randD, randD);
  }
  classifyVideo();
}
