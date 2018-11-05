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
_dice: [],
_event: [],

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
    this._categories = [this._players, this._ttplayers, this._dice];
},

init: function() {
  const cx = 200,
        cy = 200;

  // generate my player
  this.generatePlayer({
    cx: cx,
    cy: cy,
    id: 'myplayer',
    my_player: true
  })

  this.generateDie({
    cx: cx,
    cy: cy
  })

  // let the server know that a new player has joined the game
  networkManager.emit('new player');
},

generatePlayer: function(descr) {
    this._players.push(new Player(descr));
},

generateDie: function(descr) {
  this._dice.push(new Die(descr));
},

generateDie: function(descr) {
    this._event.push(new Event(descr));
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
