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
            player = g_sprites.mario;
            break;
        case 1:
            player = g_sprites.luigi;
            break;
        case 2:
            player = g_sprites.pinkPeach;
            break;
        case 3:
            player = g_sprites.yoshi;
            break;
        case 4:
            player = g_sprites.wario;
            break;
        case 5:
            player = g_sprites.yellowPeach;
            break;
        case 6:
            player = g_sprites.waluigi;
            break;
    }
    this.sprite = player;

    let scale = 0.8;
    this.width  = this.map.tilesWidth * scale;
    this.height = this.map.tilesHeight * scale;
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
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
};
