
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
Die.prototype.rollIter = 0;

Die.prototype.isCollision = false;

Die.prototype.currRand = 0;
Die.prototype.prevRand = 0;

Die.prototype.timeIter = 0;

// ===========
// SIDE_SPRITE
// ===========

// set sprite to specific side
Die.prototype.side_sprite = function(value) {
  switch(value) {
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
  // animation! Every 4th frame
  if (Math.floor(this.rollIter) % 4 === 0 ){//&& this.timeIter < 100) {
    // never the same number twice in a row
    while (this.currRand === this.prevRand) {
      this.currRand = this.rand();
    }
    this.prevRand = this.currRand;
    this.side_sprite(this.currRand);
  }
  this.rollIter++;
  // emit to the server
  networkManager.socket.emit("die_sprite", this.currRand);

  // we let the die roll for some time
  this.timeIter++;

  //if (this.timeIter < 100) return;
  /*if(this.isCollision === false) return;

  console.log("dice done")
  this.isCollision = false;
  // when the timeIter reaches 100 we perform the actual dice throw
  //const diceThrow = this.rand();
  this.diceThrow = 3;
  // we stop this from running (from the update loop)
  this.isRolling = false;
  // we display the correct side
  this.side_sprite(this.diceThrow);
  // emit the correct side to the server
  networkManager.socket.emit("die_sprite", this.diceThrow);
  // reset stuff
  this.rollIter = 0;
  this.timeIter = 0;
  // we are ready to move the player!
  mapManager.readyToMove(this.diceThrow);*/
}

Die.prototype.stopRoll = function () {
  this.isCollision = false;
  // we stop this from running (from the update loop)
  this.isRolling = false;
  // emit the correct side to the server
  networkManager.socket.emit("die_sprite", this.currRand);
  // reset stuff
  this.rollIter = 0;
  this.timeIter = 0;
  // we are ready to move the player!
  mapManager.readyToMove(this.currRand);
};

Die.prototype.getRadius = function () {
  return this.width * 0.75;
};

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
