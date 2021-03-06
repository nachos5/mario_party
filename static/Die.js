
// ===========
// CONSTRUCTOR
// ===========

function Die(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = g_sprites.die1;

    spatialManager.register(this);
};

// ==========
// PROPERTIES
// ==========

Die.prototype = new Entity();

// position on canvas
Die.prototype.cx = 0;
Die.prototype.cy = 0;
Die.prototype.scale = 1;

// showing side number
Die.prototype.side_n = 1;

Die.prototype.isRolling = false;

Die.prototype.isCollision = false;

// ===========
// SIDE_SPRITE
// ===========

// set sprite to specific side
Die.prototype.side_sprite = function(value) {
  switch(value) {
    case 0:
      this.sprite = g_sprites.die0; break;
    case 1:
      this.sprite = g_sprites.die1; break;
    case 2:
      this.sprite = g_sprites.die2; break;
    case 3:
      this.sprite = g_sprites.die3; break;
    case 4:
      this.sprite = g_sprites.die4; break;
    case 5:
      this.sprite = g_sprites.die5; break;
    case 6:
      this.sprite = g_sprites.die6; break;
    case 7:
      this.sprite = g_sprites.die7; break;
    case 8:
      this.sprite = g_sprites.die8; break;
    case 9:
      this.sprite = g_sprites.die9; break;
    case 10:
      this.sprite = g_sprites.die10; break;
    default: break;
  }
}

// ======
// RANDOM
// ======

// random number from 1-10
Die.prototype.rand = function() {
  return parseInt(Math.random() * 10) + 1;
}

// ====
// ROLL
// ====

Die.prototype.roll = function(du=1) {
  this.isRolling = true;

  this.dieFrame = animationManager.die.frame;
  this.side_sprite(this.dieFrame);
  
  // emit to the server
  networkManager.socket.emit("die_sprite", this.dieFrame);
}

// =========
// STOP ROLL
// =========

Die.prototype.stopRoll = function () {
  if (this.isRolling) {
    this.isRolling = false;
    this.isCollision = false;
    // emit the correct side to the server
    networkManager.socket.emit("die_sprite", this.dieFrame);

    // we are ready to move the player!
    mapManager.readyToMove(this.dieFrame);
  }
};

// ==========
// GET RADIUS
// ==========

Die.prototype.getRadius = function () {
  return this.width * 0.7;
};

// =================
// RESOLVE COLLISION
// =================

Die.prototype.resolveCollision = function () {
  this.isCollision = true;
  this.stopRoll();
};

// ======
// UPDATE
// ======

Die.prototype.update = function(du) {
  // WE DO SOME ANIMATION WHILE ROLLING
  if (this.isRolling) {
    this.roll(du);
  }
};

// ======
// RENDER
// ======

Die.prototype.render = function (ctx) {
    this.sprite.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
};
