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
  victoryTimer10: 0,         // 10 sec countdown timer

  // Image data
  gameRoomSprite: 0,
  scoreRoomSprite: 0,
  scoreRoomDynamicSprite: 0,
  victoryStaticSprite: 0,
  victoryDynamicSprite:0,

  // Network message
  messages: [],

  // Options
  options: [],

  // Added
  players: [],
  gamestate: {}, // emitted from the server
  turn: 1,
  all_players_ready: false,
  animation_is_running: false,

  // =========
  // INITALIZE
  // =========

  // first player starts his turn
  init: function() {

    this.victoryTimer10 = new Timer(10);
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

    // Initialize room variables
    for(let i = 0; i < this.players.length; i++) {
      this.players[i].eventPlayer.initRooms();
    }
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

  updateImageData: function() {
    g_ctx.putImageData(this.scoreRoomSprite, 0, 0);
    this.score_room.dynamicRender(g_ctx);
    this.scoreRoomDynamicSprite = g_ctx.getImageData(0, 0, mapManager.mapLeft, g_canvas.height);
  },

  updateVictoryImageData: function() {
    // Static image data
    this.victoryScreen.staticRender(g_ctx);
    this.victoryStaticSprite = g_ctx.getImageData(this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top, this.victoryScreen.victoryPopUp[0].width, this.victoryScreen.victoryPopUp[0].height);
    this.victoryStatic2Sprite = g_ctx.getImageData(this.victoryScreen.left, this.victoryScreen.top, this.victoryScreen.width, this.victoryScreen.height);
    // Dynamic image data
    this.victoryScreen.dynamicRender(g_ctx);
    this.victoryDynamicSprite = g_ctx.getImageData(this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top, this.victoryScreen.victoryPopUp[0].width, this.victoryScreen.victoryPopUp[0].height);
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

  // =================
  // UPDATE SCOREBOARD
  // =================

  updateScoreboard: function() {
    // Sort player positions
    this.players.sort((x, y) => {
      if(y.stars === x.stars) { return y.coins - x.coins };
      return y.stars - x.stars;
    });

    // Update dynamic objects render
    this.updateImageData();
  },

  // =====================
  // UPDATE PLAYER SPRITES
  // =====================

  updatePlayerSprites: function() {
    this.updateInfo();

    // Array of player sprites in use
    for(let i = 0; i < this.players.length; i++) {
      let curr_playerSprite = g_playerSprites[this.players[i].spriteID]
      g_playerSpritesInUse.push ({
        sp : curr_playerSprite.sp ,
        id : curr_playerSprite.id,
        name : curr_playerSprite.name
      });
    };
  },

  // ==================
  // UPDATE COLLECTABLE
  // ==================

  updateCollectable: function(player, collectable, amount, animation=true) {
      // Coin
      if (collectable === 'coin') {
        for (let i=0; i<amount; i++) {
          player.coins++;
          // overflow
          if (player.coins == 100) {
            player.coins = 0;
            player.stars++;
          }
        }
        const tt_player = player.tt_player;
        if (animation) {
          if (amount > 0) networkManager.emit("animation_trigger", {animation: 'coinDown', times: amount, tt_player: tt_player});   // + coin
          else networkManager.emit("animation_trigger", {animation: 'coinUp', times: -amount, tt_player: tt_player});               // - coin
        }
      }

      // Star
      if (collectable === 'star') {
        player.stars += amount;
        if (animation) {
          if (amount > 0) networkManager.emit("animation_trigger", {animation: 'starDown', times: amount, tt_player: tt_player});   // + star
          else networkManager.emit("animation_trigger", {animation: 'starUp', times: -amount, tt_player: tt_player});                // - star
        }
      }

      // Prevent error, can't own negative
      if (player.coins < 0) player.coins = 0;
      if (player.stars < 0) player.stars = 0;

      stateManager.updateImageData('scoreRoom');
  },

  // ========
  // NEW GAME
  // ========

  newGame: function() {
    // Show message to other players
    let msg = new Message({
      offsetTop   : 0.01,
      offsetRight : 0.06,
      offsetBot   : 0.8,
      offsetLeft  : 0.06,
      string      : 'JUMP INTO THE DIE/TO ROLL',
      lines       : 2,
      time        : 10,
      extra       : g_sprites.arrow,
    });

    stateManager.newMessage(msg);
    stateManager.newOptions();
  },

  // ===========
  // NEW MESSAGE
  // ===========

  newMessage: function(msg) {
    this.messages.push(msg);
  },

  // ===========
  // NEW OPTIONS
  // ===========

  newOptions: function() {
    if (this.options.length === 1) {
      this.options.pop();
      return;
    }

    let opt = new PopUp({
      offsetTop   : 0.2,
      offsetRight : 0.02,
      offsetBot   : 0.2,
      offsetLeft  : 0.02,
      word        : 'OPTIONS       //LEFT/RIGHT/JUMP/INTERACT',
      textLines   : 7,
    });
    opt.setPreset('options');

    this.options.push(opt);
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
    let bool = eventManager.anotherTurn;
    // we are ready for the next turn
    this.nextTurn(bool);
    // let the server know so he can let all other players know
    networkManager.socket.emit('next_turn', bool);
  },

  // =========
  // NEXT TURN
  // =========

  // map manager calls this
  nextTurn: function(anotherTurn=false) {
    // Update Scoreboard positions
    this.updateScoreboard();

    if (!anotherTurn) {
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
        this.turn = 0;
        // minigame manager calls the next round function
        this.nextRound();
        //minigameManager.initMinigame();
      }
      this.turn++;
    }

    // If the game is over stop updating
    if (!g_gameOver) {
      // Roll the die for the next player
      if (this.curr_player.my_player) {
        entityManager.getDie().roll();
      }

      // Update Player Turn
      this.game_room.currPlayer = this.curr_player;

      eventManager.anotherTurn = false;
    }
  },

  // ==========
  // NEXT ROUND
  // ==========

  nextRound: function() {

    if (this.rounds_remaining <= 1) {

      if (!g_gameOver) {
        // victory music!
        audioManager.fadeOut(0.2);

        this.victoryScreen = new Victory(this.players);
        // Static image data
        this.victoryScreen.staticRender(g_ctx);
        this.victoryStaticSprite = g_ctx.getImageData(this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top, this.victoryScreen.victoryPopUp[0].width, this.victoryScreen.victoryPopUp[0].height);
        // Dynamic image data
        this.victoryScreen.dynamicRender(g_ctx);
        this.victoryDynamicSprite = g_ctx.getImageData(this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top, this.victoryScreen.victoryPopUp[0].width, this.victoryScreen.victoryPopUp[0].height);

        entityManager.victory();
        // Freeze interactive objects except event player
        g_gameOver = true;
      }

      // Set Round to zero
      this.rounds_remaining = 0;
      this.score_room.num1 = 0;
      this.score_room.num2 = 0;
    }
    else {
      audioManager.fadeOutPlayNext('map', 2);
      // Decrement Round
      this.rounds_remaining--;

      // Update Round number
      this.score_room.num1 = Math.floor(this.rounds_remaining / 10);
      this.score_room.num2 = this.rounds_remaining % 10;
    }
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

    // Update server messages
    this.messages.forEach((item, index) => {
      let msgStatus = item.update(du);
      if (msgStatus === -1) this.messages.splice(index, 1);
    });

    // Update options menu
    this.options.forEach((item) => {
      item.update(du);
    });

    this.emitGameState(du);

    this.score_room.update(du);
    this.game_room.update(du);

    if (this.victoryTimer10.isTimeUp && g_gameOver && this.status !== -1) {
      this.status = this.victoryScreen.nextPopUp();
      this.victoryTimer10.startTimer();
      this.updateVictoryImageData();
    }
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

    if (this.victoryScreen) {
      // Render static object
      ctx.putImageData(this.victoryStaticSprite, this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top);
      // Render dynamic object
      ctx.putImageData(this.victoryDynamicSprite, this.victoryScreen.victoryPopUp[0].left, this.victoryScreen.victoryPopUp[0].top);
      this.victoryScreen.render(ctx);
    }
  },

  // ===============
  // PRIORITY RENDER
  // ===============

  priorityRender: function(ctx) {
    // Render server messages
    this.messages.forEach((item) => {
      item.staticRender(ctx);
      item.dynamicRender(ctx);
      item.render(ctx);
    });

    // Update options menu
    this.options.forEach((item) => {
      item.staticRender(ctx);
      item.dynamicRender(ctx);
      item.render(ctx);
    });
  },
}
