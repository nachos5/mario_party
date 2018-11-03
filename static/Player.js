// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Player.prototype.KEY_UP = 'W'.charCodeAt(0);
Player.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;
Player.prototype.velX = 1;
Player.prototype.velY = 1;
Player.prototype.numSubSteps = 1;

Player.prototype.update = function (du) {

    // unregister the entity
    spatialManager.unregister(this);

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;

    // we can only move our player
    if (this.my_player) {
      for (var i = 0; i < steps; ++i) {
          this.computeSubStep(dStep);
      }
    }

    if (this.isColliding()) {
    } else {
      spatialManager.register(this);
    }

    // we only emit our player to the server!
    if (this.my_player) {
      // emit players position to the server
      networkManager.emit("position", {
        cx: this.cx,
        cy: this.cy,
        rotation: this.rotation
      })
    }
};

Player.prototype.computeSubStep = function (du) {

  if (keys[this.KEY_UP]) {
      this.cy -= 5;
  }
  if (keys[this.KEY_DOWN]) {
      this.cy += 5;
  }
  if (keys[this.KEY_LEFT]) {
      this.cx -= 5;
  }
  if (keys[this.KEY_RIGHT]) {
      this.cx += 5;
  }
};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Player.prototype.reset = function () {
    //this.setPos(this.reset_cx, this.reset_cy);
    this.setPos(Math.random()*g_canvas.width, Math.random()*g_canvas.height);
    this.rotation = this.reset_rotation;

    this.halt();
};

Player.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    const sprite = this.sprite;
    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.rotation);
    this.sprite.scale = origScale;
};
