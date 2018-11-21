// ===========
// CONSTRUCTOR
// ===========

function Star(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.width = mapManager.currentMap.tilesWidth * 0.8;
    this.height = mapManager.currentMap.tilesHeight * 0.8;
    this.originalWidth = mapManager.currentMap.tilesWidth * 0.8;
    this.originalHeight = mapManager.currentMap.tilesHeight * 0.8;
    this.rotation = 0;
    this.rotate = true;
    this.sprite = g_itemSprites[1].sp; // star sprite

    this.map = mapManager.getMap();
    this.position = {row: -1, column: -1}; // init
    this.centerX = this.map.mapLeft + this.map.tilesWidth / 2;
    this.centerY = this.map.mapTop + this.map.tilesHeight / 2 - 1;

    this.alpha = 1;
};

// ==========
// PROPERTIES
// ==========

Star.prototype = new Entity();

Star.prototype.getPosition = function() {
  return {cx: this.cx, cy: this.cy};
};

Star.prototype.setPosition = function(pos) {
  this.cx = pos.cx;
  this.cy = pos.cy;
};

Star.prototype.getTilePosition = function() {
  return {row: this.position.row, column: this.position.column};
};

Star.prototype.setTilePosition = function(pos) {
  this.position.row = pos.row;
  this.position.column = pos.column;
};


Star.prototype.update = function(du) {
  this.cx = this.position.column * this.map.tilesWidth  + this.centerX;
  this.cy = this.position.row * this.map.tilesHeight + this.centerY;
  if (this.rotate) {
    this.rotation += 0.008 * du * Math.PI;
    if (this.rotation >= 2 * Math.PI) this.rotation = 0; // reset
  }
};

Star.prototype.render = function(ctx) {
  if (!minigameManager.minigame_is_running && networkManager.all_players_ready) {
    ctx.globalAlpha = this.alpha;
    this.sprite.drawCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
    ctx.globalAlpha = 1;
  }
};
