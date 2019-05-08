// export default class Arena {
class Arena {

  // """
  // An Arena class where any 2 agents can be pit against each other.
  // """
  //
  constructor(player1, player2, game, display) {
    console.log('Arena constructor');
    this.player1 = player1;
    this.player2 = player2;
    this.game = game;
    this.display = display;

    // Grimmer. used for pretrained-ai vs human
    this.players = null;
    this.curPlayer = 0; // 0:dummy. real values: 1 or -1
    this.boardNdArray = null;
  }

  gameMoveByAction(action) {
    let valids = this.game.getValidMoves(this.game.getCanonicalForm(this.boardNdArray, this.curPlayer), 1);
    valids = valids.tolist();
    if (valids[action] == 0) {
      console.log(action);
      // assert valids[action] >0
      throw 'can not find out valid action, something wrong';
    }
    const nextState = this.game.getNextState(this.boardNdArray, this.curPlayer, action);
    this.boardNdArray = nextState.boardNdArray;
    squares = this.boardNdArray.tolist();
    console.log('gmbA +' + squares);
    this.curPlayer = nextState.curPlayer;
  }

  humanStep(action) {
    console.log('humanStep');
    console.log(`current Player: ${this.curPlayer}`);

    let aiAction = -1;
    if (!this.players[this.curPlayer + 1].isHuman) {
      console.log('current player is ai, ignore');
      return aiAction;
    }

    // 上一個ai造成的ended?
    if (this.game.getGameEnded(this.boardNdArray, this.curPlayer) !== 0) {
      // game is ended
      console.log('should not happen, game is ended already');
    }

    this.display(this.boardNdArray);

    // 1. human's step.
    this.gameMoveByAction(action);


    console.log("before" + squares);



    // 2. auto ai
    aiAction = this.tryToPlayAIStep();

    let list = this.boardNdArray.tolist();
    console.log(list);
    squares = list;

    console.log("after " + squares);


    if (this.game.getGameEnded(this.boardNdArray, this.curPlayer) !== 0) {
      // game is ended
      // if (verbose) {
      // console.log(`Game is ended: Turn ${it}. Result ${this.game.getGameEnded(this.boardNdArray, 1)}`);
      // assert(self.display)
      this.display(this.boardNdArray);
      // }

      // means it is ended
      // return this.game.getGameEnded(this.boardNdArray, this.curPlayer);
    }

    return aiAction;
  }

  // it will affect who is the first player of a new game
  swapTwoPlayers() {
    console.log('swap');
    const tmpPlayer1 = this.player1;
    this.player1 = this.player2;
    this.player2 = tmpPlayer1;
  }

  tryToPlayAIStep() {
    let action = -1;
    console.log('tryToPlayAIStep');
    if (!this.players[this.curPlayer + 1].isHuman) {
      if (this.game.getGameEnded(this.boardNdArray, this.curPlayer) === 0) {
        this.display(this.boardNdArray);
        console.log(`Player ${this.curPlayer}`);

        //squares here???
        //set up squares from the weird list thing
        // let count = 0;
        // let boardNdArray = this.game.getInitBoardNdArray();
        let list = this.boardNdArray.tolist();
        console.log("AI list " + list);
        squares = list;
        console.log("AI squares " +squares);

        action = this.players[this.curPlayer + 1].play(this.game.getCanonicalForm(this.boardNdArray, this.curPlayer));
        this.gameMoveByAction(action);
      } else {
        console.log('game is already ended');
      }
    } else {
      console.log('current player is human, ignore');
    }

    return action;
  }

  // TODO:
  // 1. [done] let ui responsbile for the logic about restarts a game
  // 2. [done] let ui responsbile for calling swap function
  // 3. handle the case to give up+restart game. this.game needs reset
  playNewGameWithHuman() {
    this.players = [this.player2, null, this.player1];
    this.curPlayer = 1;
    this.boardNdArray = this.game.getInitBoardNdArray(); // !!!
    squares = this.boardNdArray.tolist();
    console.log('pngwh' + squares);
    // first player (player1) may be human or AI
    return this.tryToPlayAIStep();
  }

  //this is each individual game from start to finish
  playGame(verbose = false) {
    const players = [this.player2, null, this.player1];
    let curPlayer = 1;
    let boardNdArray = this.game.getInitBoardNdArray();
    let it = 0;
    let slowDown = millis();
    while (this.game.getGameEnded(boardNdArray, curPlayer) === 0) {
      // if (millis() - slowDown >= slowTimer && awaitToggle) {
        it += 1;
        if (verbose) {
          this.display(boardNdArray);
          console.log(`Turn ${it}. Player ${curPlayer}`);
        }
        const action = players[curPlayer + 1].play(this.game.getCanonicalForm(boardNdArray, curPlayer));
        let valids = this.game.getValidMoves(this.game.getCanonicalForm(boardNdArray, curPlayer), 1);
        valids = valids.tolist();

        if (valids[action] == 0) {
          console.log(action);
          // assert valids[action] >0
          throw 'can not find out valid action, something wrong';
        }
        const nextState = this.game.getNextState(boardNdArray, curPlayer, action);
        boardNdArray = nextState.boardNdArray;
        curPlayer = nextState.curPlayer;
        // squares = boardNdArray.tolist();
        // console.log(squares);
        // awaitToggle = false;
        // console.log("1" + awaitToggle);
        // drawGame(squares);
        // console.log("4" + awaitToggle);
        // slowDown = millis();
        // console.log(slowDown);
      }
    // }

    if (verbose) {
      console.log(`Game over: Turn ${it}. Result ${this.game.getGameEnded(boardNdArray, 1)}`);
      // assert(self.display)
      this.display(boardNdArray);
    }

    return this.game.getGameEnded(boardNdArray, 1);
  }

  //so this is the total number of plays
  playGames(num, verbose = false) {
    num = Math.floor(num / 2);
    let oneWon = 0;
    let twoWon = 0;
    let draws = 0;
    for (let i = 0; i < num; i++) {
      const gameResult = this.playGame(verbose);
      if (gameResult == 1) {
        oneWon += 1;
      } else if (gameResult == -1) {
        twoWon += 1;
      } else {
        draws += 1;
      }
    }

    this.swapTwoPlayers();

    console.log(squares);


    for (let i = 0; i < num; i++) {
      const gameResult = this.playGame(verbose);
      if (gameResult == -1) {
        oneWon += 1;
      } else if (gameResult == 1) {
        twoWon += 1;
      } else {
        draws += 1;
      }
    }
    p1wins = oneWon;
    p2wins = twoWon;
    drawsTotal = draws;
    return { oneWon, twoWon, draws };
  }
}
