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
  settings = createDiv('Training Settings: ')
    .parent('settingsContainer')
    .id('settings');

  //- - - - - - - - - all the butts
  //
  // twoRandomButt = createButton('Two Random Players Game') //what does this mean?
  //   // .position()
  //   .parent("settings")
  //   .mousePressed(twoRandomPlay);
  //start self train in browser
  startTrainButt = createButton('Start Self Train')
    // .position()
    .parent("settings")
    .mousePressed(startTrain);
  //self trained vs Random
  selfTrainVSRandomButt = createButton('Self Trained vs Random')
    // .position()
    .parent("settings")
    .mousePressed(selfTrainVSRandom);

  //pretrained vs random games ???
  twoRandomWithPreTrainedButt = createButton('Start pretrained vs Random Games')
    // .position()
    .parent("settings")
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
    .parent("settings")
    .mousePressed(downloadPretrained);
  //download pretrained model
  startNewGameButt = createButton("Start Game?") //not sure what this is
    // .position()
    .parent("settings")
    .mousePressed(startNewGame);

    //empty board to start
    drawGame(squares);
}

function draw(){
  // if (gameStarted){
  //   fill(255);
  // } else if (gameOver){
  //   fill(255, 200, 200);
  // } else {
  //   fill(125);
  // }
  // //draw the board
  // stroke(0);
  // for (let y = 0; y < 3; y ++){ //row
  //   for (let x = 0; x < 3; x++){ //col
  //     rect(x*squareSize, y*squareSize, squareSize, squareSize);
  //     if (squares[y][x] != 0){ // X: -1, O: 1
  //       push();
  //       fill(0);
  //       noStroke();
  //       if (squares[y][x] == -1){
  //         text("X", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
  //       } else{// it's 1
  //         text("O", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
  //       }
  //       pop();
  //     }
  //   }
  // }
}



  // let x = 0;
  // let y = 0;
  // for (let i = 0; i < squares.length; i++){
  //   rect(x*squareSize, y*squareSize, squareSize, squareSize);
  //   //if there have been moves, draw them
  //   if (squares[i] != 0){ // X: -1, O: 1
  //     push();
  //     fill(0);
  //     noStroke
  //     if (squares[i] == -1){
  //       text("X", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
  //     } else{// it's 1
  //       text("O", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
  //     }
  //     pop();
  //   }
  //   //move the next square spot
  //   if (x < 2){
  //     x++;
  //   } else {
  //     y++;
  //     x = 0;
  //   }

//when human player, click to play
function mousePressed(){
  // if (humanPlaying)
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
      fill(125);
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
          } else{// it's 1
            text("O", ((x*2)+1)*textSpot, ((y*2)+1)*textSpot);
          }
          pop();
        }
      }
    }
    // console.log('in promise');
  // });
}


// functions from Grimmer's app.js class
// "this.state" now just "state"
// and "randowm" now "random"
state = {
  enabledAI: false,
  aiIsDownloaded: false,
  aiFirst: true,
  selfTrained: false
};

// twoRandomPlay =() => {
//   play();
// }

startTrain = async () => {
  console.log('start-train');
  await train();
  console.log('end-train');
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
    console.log('ui start to download2');
    // this.setState({ aiIsDownloaded: true });
    state.aiIsDownloaded = true;
  }
}

toggleAI = () => {
  // this.setState({ enabledAI: !this.state.enabledAI });
  state.enabledAI = !state.enabledAI;
}

//need this? need to implement on mousePressed
handleClick = action => humanMove(action)

startNewGame = () => {
  console.log('start new game');
  if (state.enabledAI) {
    if (state.selfTrained === false && state.aiIsDownloaded === false) {
      alert('ai is not download yet');
    }
    gameStarted = true;
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
