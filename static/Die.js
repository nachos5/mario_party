// A generic contructor which accepts an arbitrary descriptor object
function Die(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = g_sprites.die1;
};

Die.prototype = new Entity();

// position on canvas
Die.prototype.cx = 0;
Die.prototype.cy = 0;
Die.prototype.scale = 1;

// showing side number
Die.prototype.side_n = 1;

Die.prototype.isRolling = false;
Die.prototype.rollIter = 0;

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

// random number from 1-6
Die.prototype.rand = function() {
  return parseInt(Math.random() * 10) + 1;
}

Die.prototype.currRand = 0;
Die.prototype.prevRand = 0;

Die.prototype.timeIter = 0;

Die.prototype.roll = function() {
  this.isRolling = true;
  // animation! Every 4th frame
  if (Math.floor(this.rollIter) % 4 == 0 && this.timeIter < 100) {
    // never the same number twice in a row
    while (this.currRand == this.prevRand) {
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

  if (this.timeIter < 100) return;

  // when the timeIter reaches 100 we perform the actual dice throw
  const diceThrow = this.rand();
  // we stop this from running (from the update loop)
  this.isRolling = false;
  // we display the correct side
  this.side_sprite(diceThrow);
  // emit the correct side to the server
  networkManager.socket.emit("die_sprite", diceThrow);
  // reset stuff
  this.rollIter = 0;
  this.timeIter = 0;
  // we are ready to move the player!
  mapManager.readyToMove(diceThrow);

}

Die.prototype.update = function(du) {
  // WE DO SOME ANIMATION WHILE ROLLING
  if (this.isRolling) {
    this.roll();
  }
}

Die.prototype.render = function (ctx) {
    this.sprite.drawTopLeftFixed(ctx, this.cx, this.cy, 0, 1, 1, this.width, this.height);
};
