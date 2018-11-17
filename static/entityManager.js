// ==============
// ENTITY MANAGER
// ==============

var entityManager = {

_players: [],       // Players
_dice: [],          // Dice Room
_eventBlocks: [],   // Event Room
_stars: [],

_gravity: 0.12,     // Constant

// Shared data from stateManager
_gameRoomcx: null,
_gameRoomcy: null,
_gameRoomBrickWidth: null,
_gameRoomBrickHeight: null,

// Current player
_curr_player: null,
_curr_tt_player: null,

// Animations
_animation: null,       // Current animation
_isAnimation: false,    // Is anything animating

_aniTimes: 0,           // Times to repeat animation
_aniIter: 0,            // Animation iterator
_aniFrame: 0,           // Animation frame

_aniUp: false,          // Animation moving up
_aniDown: false,        // Animation moving down

_aniX: 0,               // Animation x offset
_aniY: 0,               // Animation y offset
_aniAlpha: 1,           // Animation alpha level

// ============
// _FOR EACH OF
// ============

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._players, this._dice, this._eventBlocks, this._stars];
},

init: function() {
  console.log("init");

  if (!localStorage.getItem('uuid')) {
    localStorage.setItem('uuid', Math.random().toString(12));
  };

  this.generatePlayer({
    uuid: localStorage.getItem('uuid'),
    socket_id: networkManager.player_info.socket_id,
    my_player: true,
    connected: true,
    stars: 0,
    coins: 0,
    player_id: networkManager.player_info.player_id,
    spriteID: networkManager.player_info.spriteID,
  });

  // let the server know that a new player has joined the game
  networkManager.emit('new player', this._players[0]);
},

// Initialize shared objects
sharedObjects: function() {
    this.getData();

    this.generateDie({
        width: this._gameRoomBrickWidth * 3,
        height: this._gameRoomBrickHeight * 3,

        cx: this._gameRoomcx + (this._gameRoomBrickWidth  * 5) + this._gameRoomBrickWidth * 1.5,
        cy: this._gameRoomcy + (this._gameRoomBrickHeight * 6) + this._gameRoomBrickHeight * 1.5
      });

    this.generateStar({
      cx: -100,
      cy: -100
    });
    // first player on the network generates the initial star position and rolls the die
    if (this._players[0].player_id == 1) {
      mapManager.moveStar();
      this.getDie().roll();
      //audioManager.playAndEmit("jump", 0, true, 1);
    }

    // Initalize variables in eventPlayer
    for(let i = 0; i < this._players.length; i++) {
        this.initEventPlayer(this._players[i]);
    }
},

// betra fyrir mig að hafa þetta svona útaf networking
initEventPlayer: function(player) {
  // Start in Dice Room
  player.eventPlayer.cx = this._gameRoomcx + this._gameRoomBrickWidth * 6.5;
  player.eventPlayer.cy = this._gameRoomcy + this._gameRoomBrickHeight * 11;

  player.eventPlayer.room = 0;
  player.eventPlayer.bot = stateManager.game_room.diceRoomBot;

  player.eventPlayer.width = this._gameRoomBrickWidth * 1.5;
  player.eventPlayer.height = this._gameRoomBrickHeight * 1.5;

  player.eventPlayer.rememberResets();
},

// ========
// GET DATA
// ========

// Get data from other managers
getData: function() {
    // stateMangager -> GameRoom
    this._gameRoomcx = stateManager.game_room.cx;
    this._gameRoomcy = stateManager.game_room.cy;
    this._gameRoomBrickWidth  = stateManager.game_room.brick.width * stateManager.game_room.brickScaleX;
    this._gameRoomBrickHeight = stateManager.game_room.brick.height * stateManager.game_room.brickScaleY;
},

generatePlayer: function(descr) {
    this._players.push(new Player(descr));
},

pushPlayer: function(player) {
  this._players.push(player);
},

getMyPlayer: function() {
  return entityManager._players.find(player => player.my_player == true);
},

generateDie: function(descr) {
  this._dice.push(new Die(descr));
},

// returns the first die
getDie: function() {
  return this._dice[0];
},

generateStar: function(descr) {
  this._stars.push(new Star(descr));
},

// returns the first star
getStar: function() {
  return this._stars[0];
},

generateEventBlocks: function() {
    console.log(this._gameRoomcx);
    let descr = {
        brickWidth: this._gameRoomBrickWidth,
        brickHeight: this._gameRoomBrickHeight,
        x: this._gameRoomcx,
        y: this._gameRoomcy,
        width: this._gameRoomBrickWidth * 2,
        height: this._gameRoomBrickHeight* 2
    }
    this._eventBlocks.push(new EventBlocks(descr));
},

resolveEventBlocks: function(entity) {
    let winner = entity.block2.winner;

    let p1   = entity.block1.results;
    let item = entity.block2.results;
    let p2   = entity.block3.results;

    if (winner === this._curr_player.spriteID) {
        if (item === 0) {
            console.log("play animation")
            this.playAnimation(0);
        }
    }
    else {
        this.playAnimation(1);
    }
},

resetPlayers: function() {
    this._forEachOf(this._players, Player.prototype.reset);
},

haltPlayers: function() {
    this._forEachOf(this._players, Player.prototype.halt);
},

updateCurrPlayer: function() {
    this._curr_player = stateManager.curr_player;
    this._curr_tt_player = this._curr_player.tt_player;
},

victory: function() {
    // Set position of tabletop players to avoid overlap in rendering
    // Set event players into the victory room
    for(let i = 0; i < this._players.length; i++) {
        this._players[i].tt_player.reset();
    }
},

playAnimation: function(animation) {
    if (animation === 0) { this._aniDown = true }   // + 3 coins
    if (animation === 1) { this._aniUp = true }     // - 3 coins

    this._animation = animation
    this._isAnimation = true;
},

stopAnimation: function() {
    this._aniFrame = 0;
    this._aniIter = 0;
    this._aniTimes = 0;

    this._aniX = 0;
    this._aniY = 0;
    this._aniAlpha = 1;

    this._aniUp = false;
    this._aniDown = false;

    this._animation = null;
    this._isAnimation = false;
    mapManager.eventIsRunning = false; // event is done
},

update: function(du) {

    this.updateCurrPlayer();

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            let status = 0;
            // try catch for stuff not using an update function (die for example)-
            try {
              status = aCategory[i].update(du);
            } catch(e){}

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

    // Animations
    if (g_useAnimation && this._isAnimation) {

        // Coin animation
        if (this._animation === 0 || this._animation === 1) {
            // Swap frames every 10th frame
            if (this._aniIter % 6 == 0) {
                this._aniFrame += 1;
            }
            this._aniIter++;
            if (this._aniDown) { this._aniY-- }
            if (this._aniUp) { this._aniY++ }
            this._aniAlpha -= 0.03;
            // Restart
            if(this._aniIter === 30) {
                audioManager.playAndEmit("coin", 0.2, false, 1);
                this._aniFrame = 0;
                this._aniIter = 0;
                this._aniY = 0;
                this._aniAlpha = 1;
                this._aniTimes++;
                if (this._aniTimes === 3) {
                    this.stopAnimation();
                }
            };
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
        }
        debugY += 10;
    }

    // Render animations
    if (this._isAnimation) {
        // To prevent bugs with alpha level
        if (this._aniAlpha < 0) { this._aniAlpha = 0}
        ctx.globalAlpha = this._aniAlpha;

        // +- 3 Coin
        if (this._animation === 0 || this._animation === 1) {
            g_aniSprites.coin[this._aniFrame].drawClipCentredAtFixed(ctx, this._curr_tt_player.cx, this._curr_tt_player.cy - this._curr_tt_player.height + this._aniY, 0, this._curr_tt_player.width * 2/3, this._curr_tt_player.height * 2/3);
        }
        // Reset ctx
        ctx.globalAlpha = 1;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
