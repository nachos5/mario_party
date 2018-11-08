/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_players: [],
_ttplayers: [], // tabletop players
_dice: [],  // Dice Room
_eventBlocks: [],   // Event Room

// Shared data from stateManager
_gameRoomcx: null,
_gameRoomcy: null,
_gameRoomBrickWidth: null,
_gameRoomBrickHeight: null,

// "PRIVATE" METHODS

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
    this._categories = [this._players, this._ttplayers, this._dice, this._eventBlocks];
},

init: function() {
  const cx = 300,//this._gameRoomcx + this.brickWidth * 5.5,
        cy = 300;//this._gameRoomcy + this.brickHeight * 18;

  entityManager.generatePlayer({
    cx: cx,
    cy: cy,
    uuid: localStorage.getItem('uuid'),
    my_player: true,

    // Added
    stars: 0,
    coins: 0,
    player_id: networkManager.player_info.player_id
  });

  //console.log(entityManager._players[0]);

  // let the server know that a new player has joined the game
  networkManager.emit('new player', entityManager._players[0]);
},

// Initialize shared objects
sharedObjects: function() {
    this.getData();

    this.generateDie({
        cx: this._gameRoomcx + (this._gameRoomBrickWidth  * 5),
        cy: this._gameRoomcy + (this._gameRoomBrickHeight * 6),
        width: this._gameRoomBrickWidth * 3,
        height: this._gameRoomBrickHeight* 3
      });
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

generateDie: function(descr) {
  this._dice.push(new Die(descr));
},

// returns the first die
getDie: function() {
  return this._dice[0];
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

update: function(du) {

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
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
