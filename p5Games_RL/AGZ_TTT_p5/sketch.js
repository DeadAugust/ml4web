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


function setup() {
  let canvas = createCanvas(400, 600);
  canvas.parent('canvasContainer');

  //set up set up set up
  settings = createDiv('SETTINGS')
    .parent('settingsContainer')
    .id('settings');

  //- - - - - - - - - all the butts
  //
  twoRandomButt = createButton('Two Random Players Game') //what does this mean?
    // .position()
    .parent("settings")
    .mousePressed(twoRandomPlay);
  //start self train in browser
  startTrainButt = createButton('Start Self Train')
    // .position()
    .parent("settings")
    .mousePressed(startTrain);
  //self trained vs Random ???
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

}

function draw(){



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

twoRandomPlay =() => {
  play();
}

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
    await downloadPretrained();
    console.log('ui start to download2');
    // this.setState({ aiIsDownloaded: true });
    state.aiIsDownloaded = true;
  }
}

toggleAI = () => {
  // this.setState({ enabledAI: !this.state.enabledAI });
  state.enabledAI = !state.enabledAI;
}

//need this?
handleClick = action => humanMove(action)

startNewGame = () => {
  console.log('start new game');
  if (state.enabledAI) {
    if (state.selfTrained === false && state.aiIsDownloaded === false) {
      alert('ai is not download yet');
    }
    let action;
    if (state.selfTrained) {
      action = play(4, state.aiFirst);
    } else {
      action = play(3, state.aiFirst);
    }
    // this.setState((prevState, props) => ({ aiFirst: !prevState.aiFirst }));
    state.aiFirst = !state.aiFirst; //no idea if this is what this is supposed to be

    if (action >= 0) {
      console.log('ai starts at:', action);
      return action;
    }
  }
  return -1;
}
