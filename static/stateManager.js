// =============
// STATE MANAGER
// =============

let stateManager = {

  no_players: 0,
  curr_player: null, // enable access to current player
  curr_player_id: 1, // we iterate through the players
  rounds_remaining: 5,
  game_room: 0,
  score_room: 0,
  victoryScreen: 0,   // Victory screen

  // Image data
  gameRoomSprite: 0,
  scoreRoomSprite: 0,
  scoreRoomDynamicSprite: 0,

  // Added
  players: [],
  gamestate: {}, // emitted from the server
  turn: 1,
  all_players_ready: false,

  // =========
  // INITALIZE
  // =========

  // first player starts his turn
  init: function() {
    // we wait until all existing players have been loaded into the game

    this.updateInfo();

    // we check first if we have received the game state from the server
    if (Object.keys(this.gamestate) > 0) {
      this.curr_player_id = gamestate.curr_player_id;
    }

    this.curr_player = this.findPlayer(this.curr_player_id);
    this.curr_player.tt_player.myTurn = true;

    // Create Siderooms
    this.game_room = new GameRoom();
    this.score_room = new ScoreRoom();
    this.initObjects();

    this.imageData();
  },

  // ==========
  // IMAGE DATA
  // ==========

  // Get image data of static objects to render as a whole
  imageData: function() {
    // Static image data

    // Game room static image data
    this.game_room.staticRender(g_ctx);
    this.gameRoomSprite = g_ctx.getImageData(this.game_room.cx, 0, g_canvas.width - this.game_room.cx, g_canvas.height)
    // Score room  static image data
    this.score_room.staticRender(g_ctx);
    this.scoreRoomSprite = g_ctx.getImageData(0, 0, mapManager.mapLeft, g_canvas.height)
    
    // Dynamic image data
    // Score room dynamic image data
    this.score_room.dynamicRender(g_ctx);
    this.scoreRoomDynamicSprite = g_ctx.getImageData(0, 0, mapManager.mapLeft, g_canvas.height);
  },

  // =================
  // UPDATE IMAGE DATA
  // =================

  updateImageDate: function(room) {
    if (room === 'scoreRoom') {
      ctx.putImageData(this.scoreRoomSprite, 0, 0);
      this.score_room.dynamicRender(g_ctx);
      this.scoreRoomDynamicSprite = g_ctx.getImageData(0, 0, mapManager.mapLeft, g_canvas.height);
    }
  },

  // =================
  // INITALIZE OBJECTS
  // =================

  initObjects: function() {
      // Initialize values in ScoreRoom
      this.score_room.players = this.players;
      this.score_room.num1 = Math.floor(this.rounds_remaining / 10);
      this.score_room.num2 = this.rounds_remaining % 10;
      // Initialize values in GameRoom
      this.game_room.currPlayer = this.curr_player;
  },

  // ===========
  // UPDATE INFO
  // ===========

  updateInfo: function() {
    this.players = entityManager._players;
    this.no_players = this.players.length;
  },

  // ==========
  // NEW PLAYER
  // ==========

  // New player joined
  newPlayer: function(player) {
    this.players.push(player);
  },

  // ===========
  // FIND PLAYER
  // ===========

  // finds player by id
  findPlayer: function(id) {
    this.updateInfo();
    const player = this.players.find(obj => obj.player_id === id);
    return player;
  },

  // =============
  // FINALIZE TURN
  // =============

  // we finalize our turn by handling final events and prepare the next turn
  finalizeTurn: function() {
    let bool = eventManager.isEvent;

    if (!bool) {
      this.callNextTurn();
    }
  },

  // ==============
  // CALL NEXT TURN
  // ==============

  // eventManager can call this
  callNextTurn: function() {
    // we are ready for the next turn
    this.nextTurn();
    // let the server know so he can let all other players know
    networkManager.socket.emit('next_turn');
  },

  // =========
  // NEXT TURN
  // =========

  // map manager calls this
  nextTurn: function() {
    // Update Scoreboard positions
    this.players.sort(function(x, y){
      if(y.stars === x.stars) { return y.coins - x.coins };
      return y.stars - x.stars;
    });

    // prevPlayer ends his turn
    const prevPlayer = this.findPlayer(this.curr_player_id);
    prevPlayer.tt_player.myTurn = false;

    // next player
    this.curr_player_id++;
    if (this.curr_player_id > this.no_players) {
      this.curr_player_id = 1;
    }

    // the next player starts his turn
    this.curr_player = this.findPlayer(this.curr_player_id);
    this.curr_player.tt_player.myTurn = true;

    // Decrement round after all players have played a turn
    if (this.turn % this.no_players === 0) {
      this.turn = 1;
      this.nextRound();
    }
    this.turn++;

    // If the game is over stop updating
    if (!g_gameOver) { 
      // Roll the die for the next player
      if (this.curr_player.my_player) {
        entityManager.getDie().roll();
      }
      
      // Update Player Turn
      this.game_room.currPlayer = this.curr_player;
    }

    // Update dynamic objects render
    this.updateImageDate();
  },

  // ==========
  // NEXT ROUND
  // ==========

  nextRound: function() {

    if (this.rounds_remaining === 1) {
      this.victoryScreen = new Victory();
      entityManager.victory();
      // Freeze interactive objects except event player
      g_gameOver = true;
    }

    // Decrement Round
    this.rounds_remaining--;

    // Update Round number
    this.score_room.num1 = Math.floor(this.rounds_remaining / 10);
    this.score_room.num2 = this.rounds_remaining % 10;
  },

  // ===============
  // EMIT GAME STATE
  // ===============

  // emit game state information
  stateIter: 0,
  emitGameState: function(du) {
// we emit the gamestate
    if (Math.floor(this.stateIter) == 50) {
      networkManager.socket.emit("gamestate", {
        curr_player_id: this.curr_player_id,
      });
      this.stateIter = -1;
    }
    this.stateIter++;
  },

  // ======
  // UPDATE
  // ======

  update: function(du) {
    this.emitGameState(du);

    this.score_room.update(du);
    this.game_room.update(du);

  },

  // ======
  // RENDER
  // ======

  render: function(ctx) {
    // Render static objects
    ctx.putImageData(this.gameRoomSprite, this.game_room.cx, 0);
    ctx.putImageData(this.scoreRoomSprite, 0, 0);
    // Render dynamic objects
    ctx.putImageData(this.scoreRoomDynamicSprite, 0, 0);

    this.game_room.render(ctx);
    this.score_room.render(ctx);

    if (this.victoryScreen) { this.victoryScreen.render(ctx) }
  },

}
