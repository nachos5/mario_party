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

// showing side
Die.prototype.side = 1;

Die.prototype.roll = function() {
  const rand = parseInt(Math.random() * 6) + 1; // 1-6
  this.side = rand;
  const curr_player = stateManager.curr_player.tt_player;
  mapManager.setPosition(curr_player, rand, rand);
}

Die.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scale);
};
