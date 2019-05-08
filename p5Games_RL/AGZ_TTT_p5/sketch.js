// Alpha Go Zero on p5-based board games
// August Luhrs @DeadAugust
// for Yining Shi's Machine Learning for the Web class
// ITP Spring 2019

// p5 implementation of
// u/Grimmer1025's tf.js implementation of
// u/suragnair's python TicTacToe implementation of
// Silver et. al's Alpha Go Zero paper
// you can follow the trail starting here:
// https://github.com/grimmer0125/alphago-zero-tictactoe-js

//UI elements
let twoRandomButt, startTrainButt, selfTrainVsRandomButt;
let twoRandomWithPreTrainedButt, downloadPretrainedButt;
let aiCheck, startNewGameButt;
let p1radio, p2radio;
let p1wins = 0;
let p2wins = 0;
let drawsTotal = 0;
let slowTimer = 50;
let awaitToggle = true;

//Tic Tac Toe board
let squares = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
// let squares = ["X", "X", "O",  "O",  "X",  "X",  "O", "O",  "X"];

let squareSize, textSpot;
let gameStarted = false;
let gameOver = false;

function setup() {
  let canvas = createCanvas(400, 600);
  canvas.parent('canvasContainer');
  squareSize = width/3;
  textSpot = width/6;
  textSize(height/6);
  textAlign(CENTER, CENTER);
  background(255);
  //set up set up set up
  training = createDiv('Training: ')
    .parent('settingsContainer')
    .id('training');
  demoGames = createDiv('Demo Games: ')
    .parent('settingsContainer')
    .id('demoGames');
  playerSettings = createDiv('Player Settings: ')
    .parent('settingsContainer')
    .id('settings');


  //- - - - - - - - - all the butts
  //
  twoRandomButt = createButton('Two Random Players Game') //what does this mean?
    // .position()
    .parent("demoGames")
    .mousePressed(twoRandomPlay);
  //start self train in browser
  startTrainButt = createButton('Start Self Train')
    // .position()
    .parent("training")
    .mousePressed(startTrain);
  //self trained vs Random
  selfTrainVSRandomButt = createButton('Self Trained vs Random')
    // .position()
    .parent("demoGames")
    .mousePressed(selfTrainVSRandom);

  //pretrained vs random games ???
  twoRandomWithPreTrainedButt = createButton('Start pretrained vs Random Games')
    // .position()
    .parent("demoGames")
    .mousePressed(twoRandomPlayWithPretrained);
  //enable AI player checkbox
  aiCheck = createCheckbox("Enable AI Player", state.enabledAI)
    .parent("settings")
    .changed(function(){ //not sure why arrow doesn't work
      if (this.checked()){
        state.enabledAI = true;
      } else {
        state.enabledAI = false;
      }
    }
  );
  //download pretrained model
  downloadPretrainedButt = createButton("Download pretrained model")
    // .position()
    .parent("training")
    .mousePressed(downloadPretrained);
  //download pretrained model
  startNewGameButt = createButton("Start Game?") //not sure what this is
    // .position()
    .parent("settings")
    .mousePressed(startNewGame);

  //player choices
  //how to make look better on page...
  // p1div = createDiv('PLAYER ONE')
  //   .parent("settings")
  //   // .style("width", "100px");
  // p1radio = createRadio("p1div");
  //   p1radio.option('human')
  //   p1radio.option('preTrained')
  //   p1radio.option('selfTrained')
  //   p1radio.option('random')
  //   p1radio.style('width', '60px');
  //   p1radio.parent('settings');
  // p2div = createDiv('PLAYER TWO')
  //   .parent("settings");
  // p2radio = createRadio("p2div")
  //   p2radio.option('human')
  //   p2radio.option('preTrained')
  //   p2radio.option('selfTrained')
  //   p2radio.option('random')
  //   p2radio.style('width', '60px');
  //   p2radio.parent('settings');


    //empty board to start
    drawGame(squares);
}

function draw(){
  background(255);
  // console.log("draw squares" + squares);
  drawGame(squares);
  push();
  fill(0);
  textSize(height/10);
  textAlign(LEFT);
  text("p1 wins: " + p1wins, 10, 450);
  text("p2 wins: " + p2wins, 10, 500);
  text("draws: " + drawsTotal, 10, 550);
  pop();
}

//when human player, click to play
function mousePressed(){
  // if (humanPlaying) {
  //   humanStep(0);
  //
  // }
  let count = 0;
  for (let y = 0; y < 3; y ++){ //row
    for (let x = 0; x < 3; x++){ //col
      if (mouseX > x*squareSize && mouseX < (x+1)*squareSize
      && mouseY > y * squareSize && mouseY < (y+1)*squareSize){
        console.log(count);
        humanMove(count);
      }
      count++;
    }
  }
}


//draw game function
function drawGame(squares){
  // console.log('test');
  // return new Promise(resolve => {
    if (gameStarted){
      fill(255);
    } else if (gameOver){
      fill(255, 200, 200);
    } else {
      fill(205);
    }
    //draw the board -- should I only do this once?
    stroke(0);
    for (let y = 0; y < 3; y ++){ //row
      for (let x = 0; x < 3; x++){ //col
        rect(x*squareSize, y*squareSize, squareSize, squareSize);
        if (squares[y][x] != 0){ // X: -1, O: 1
          push();
          fill(0);
          noStroke();
          if (squares[y][x] == -1){
            text("X", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
            // console.log(" DRAW X ")
          } else{// it's 1
            text("O", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
            // console.log(" DRAW O ")
          }
          pop();
        }
      }
    }
  // console.log("2" + awaitToggle);
  // awaitToggle = true;
  // console.log("3" + awaitToggle);

}


// functions from Grimmer's app.js class
// "this.state" now just "state"
// and "randowm" now "random"
state = {
  enabledAI: true,
  aiIsDownloaded: false,
  aiFirst: true,
  selfTrained: false
};

twoRandomPlay =() => {
  play(0);
}

startTrain = async () => {
  console.log('start-train');
  let mill = millis()/1000;
  console.log(mill);
  await train();
  console.log('end-train');
  let mill2 = millis()/1000;
  console.log(mill2);
  // this.setState({ selfTrained: true });
  state.selfTrained = true;
}

selfTrainVSRandom = () => {
  console.log('selfTrainVSRandom');
  play(1);
}

twoRandomPlayWithPretrained = async () => {
  play(2);
}

downloadPretrained = async () => {
  if (state.aiIsDownloaded === false) {
    console.log('ui start to download');
    await downloadPretrainedPit();
    console.log('model downloaded');
    // this.setState({ aiIsDownloaded: true });
    state.aiIsDownloaded = true;
  }
}

toggleAI = () => {
  // this.setState({ enabledAI: !this.state.enabledAI });
  state.enabledAI = !state.enabledAI;
}

//need this? need to implement on mousePressed
// handleClick = action => humanMove(action)

startNewGame = () => {
  console.log('start new game');
  squares = [[],[],[]];
  if (state.enabledAI) {
    if (state.selfTrained === false && state.aiIsDownloaded === false) {
      alert('ai is not download yet');
    }
    // gameStarted = true;
    let action;
    if (state.selfTrained) {
      action = play(4, state.aiFirst);
    } else {
      action = play(3, state.aiFirst);
    }
    // this.setState((prevState, props) => ({ aiFirst: !prevState.aiFirst }));
    state.aiFirst = !state.aiFirst; //I'm guessing it just takes turns?

    if (action >= 0) {
      console.log('ai starts at:', action);
      return action;
    }
  }
  return -1;
}
