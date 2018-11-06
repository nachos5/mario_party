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
  }
}

// random number from 1-6
Die.prototype.rand = function() {
  return parseInt(Math.random() * 6) + 1;
}

Die.prototype.currRand = 0;
Die.prototype.prevRand = 0;

Die.prototype.roll = function() {
  this.isRolling = true;
  // random number from 1-6
  const diceThrow = this.rand();
  // set position of current player after timeout
  const curr_player = stateManager.curr_player.tt_player;
  const time_ms = 2000;

  const self = this; // because of scoping inside timeout
  const timeout = setTimeout(function() {
    self.isRolling = false;
    self.side_sprite(diceThrow); // we display the correct side
    self.rollIter = 0;
    mapManager.steps(curr_player, diceThrow);
    clearTimeout(timeout);
  }, time_ms)
}

Die.prototype.update = function() {
  // WE DO SOME ANIMATION WHILE ROLLING (from the roll function)
  if (this.isRolling) {
    // we don't want to run this every frame
    if (this.rollIter % 4 == 0) {
      // never the same number twice in a row
      while (this.currRand == this.prevRand) {
        this.currRand = this.rand();
      }
      this.prevRand = this.currRand;

      this.side_sprite(this.currRand);
    }

    this.rollIter++;
  }
}

Die.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scale);
};
