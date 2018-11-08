// ============
// EVENT PLAYER
// ============

// ===========
// CONSTRUCTOR
// ===========

function EventPlayer(id) {

};

// ======
// UPDATE
// ======

EventPlayer.prototype.update = function (du) {
    this.cx = this.position.column * this.map.tilesWidth  + this.centerX;
    this.cy = this.position.row * this.map.tilesHeight + this.centerY;
  };
  
  // =====
  // RESET
  // =====
  
  EventPlayer.prototype.reset = function () {
  
  };
  
  // ======
  // RENDER
  // ======
  
  EventPlayer.prototype.render = function (ctx) {
      this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
  };