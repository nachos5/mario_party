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

// get a random player that is not my player
getRandPlayer: function() {
  const my_player = this.getMyPlayer();
  let rand_arr = [];
  for (let i=1; i<=entityManager.players.length; i++) {
    if (i != my_player.player_id) rand_arr.push(i);
  }
  const rand = parseInt(Math.random() * rand_arr.length);
  const rand_index = rand_arr[rand_index];
  const rand_player = this._players.find(obj => obj.player_id == rand_index);

  return rand_player;
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

update: function(du) {

    this.updateCurrPlayer();

    // Kill map star when game is over
    if (g_gameOver) {
        this._stars.pop();
    }

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
    for(let i = 0; i < animationManager.mapAnimations.length; i++) {
        ctx.globalAlpha = animationManager.mapAnimations[i].alpha;

        let frame = animationManager.mapAnimations[i].frame;
        let cy = animationManager.mapAnimations[i].cy;

        // Coin animation
        if (animationManager.mapAnimations[i].preset === 'mapCoin') {
            g_aniSprites.coin[frame].drawClipCentredAtFixed(ctx, this._curr_tt_player.cx, this._curr_tt_player.cy - this._curr_tt_player.height + cy, 0, this._curr_tt_player.width * 2/3, this._curr_tt_player.height * 2/3);
        }
        // Star animation
        if (animationManager.mapAnimations[i].preset === 'mapStar') {
            g_itemSprites[1].sp.drawCentredAtFixed(ctx, this._curr_tt_player.cx, this._curr_tt_player.cy - this._curr_tt_player.height + cy, 0, this._curr_tt_player.width * 2/3, this._curr_tt_player.height * 2/3);
        }
        // Die animation
        if (animationManager.mapAnimations[i].preset === 'mapDie') {
            g_sprites['die'+[frame]].drawCentredAtFixed(ctx, this._curr_tt_player.cx, this._curr_tt_player.cy - this._curr_tt_player.height + cy, 0, this._curr_tt_player.width * 2/3, this._curr_tt_player.height * 2/3);
        }
    }
    // Reset ctx
    ctx.globalAlpha = 1;
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
