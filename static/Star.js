// ===========
// CONSTRUCTOR
// ===========

function Star(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.width = mapManager.currentMap.tilesWidth;
    this.height = mapManager.currentMap.tilesHeight;
    this.sprite = g_itemSprites[1].sp; // star sprite
};

// ==========
// PROPERTIES
// ==========

Star.prototype = new Entity();

Star.prototype.getPosition = function() {
  return {cx: this.cx, cy: this.cy};
};

Star.prototype.setPosition = function(pos) {
  console.log(pos);
  this.cx = pos.cx;
  this.cy = pos.cy;
};

Star.prototype.getTilePosition = function() {

};

Star.prototype.setTilePosition = function() {

};


Star.prototype.update = function(du) {

};

Star.prototype.render = function(ctx) {
  this.sprite.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
};
