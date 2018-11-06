// ===============
// TABLETOP Player
// ===============

// ===========
// CONSTRUCTOR
// ===========

function TableTopPlayer(id) {
    this.position = mapManager.getStartPosition();
    this.prevPosition = {column: -1, row: -1};
    this.id = id;   // Id of the player

    this.map = mapManager.getMap();

    this.centerX = this.map.mapLeft + this.map.tilesWidth / 2;
    this.centerY = this.map.mapTop + this.map.tilesHeight / 2;
    this.rotation = 0;

    //this.rememberResets();

    // ====================
    // SELECT PLAYER SPRITE
    // ====================

    let player = null;

    switch(this.id) {
        case 0:
            player = g_sprites.blackPlayer;
            break;
        case 1:
            player = g_sprites.bluePlayer;
            break;
        case 2:
            player = g_sprites.greenPlayer;
            break;
        case 3:
            player = g_sprites.purplePlayer;
            break;
        case 4:
            player = g_sprites.redPlayer;
            break;
        case 5:
            player = g_sprites.whitePlayer;
            break;
        case 6:
            player = g_sprites.yellowPlayer;
            break;
    }
    this.sprite = player;

    // Scale down sprite to tile size
    if(this.sprite.width > this.sprite.height) { this.scale = this.map.tilesWidth / this.sprite.width }
    else { this.scale = this.map.tilesHeight / this.sprite.height }

    this.scale *= 0.8;  // 90% of tile size
};

TableTopPlayer.prototype = new Entity();

TableTopPlayer.prototype.rememberResets = function () {

};

// ======
// UPDATE
// ======

TableTopPlayer.prototype.update = function (du) {
  this.cx = this.position.column * this.map.tilesWidth  + this.centerX;
  this.cy = this.position.row * this.map.tilesHeight + this.centerY;
};

// =====
// RESET
// =====

TableTopPlayer.prototype.reset = function () {

};

// ======
// RENDER
// ======

TableTopPlayer.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation, this.scale);
};
