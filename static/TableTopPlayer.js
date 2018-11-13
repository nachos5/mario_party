// ===========
// CONSTRUCTOR
// ===========

function TableTopPlayer(descr) {

    this.setup(descr);

    this.position = mapManager.getStartPosition();
    this.prevPosition = {column: -1, row: -1};

    this.map = mapManager.getMap();

    this.centerX = this.map.mapLeft + this.map.tilesWidth / 2;
    this.centerY = this.map.mapTop + this.map.tilesHeight / 2;
    this.rotation = 0;
    this.alpha = 1;

    // ====================
    // SELECT PLAYER SPRITE
    // ====================
/*
    let player = null;

    switch(this.id) {
        case 0:
            player = g_sprites.luigi;
            break;
        case 1:
            player = g_sprites.mario;
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
    this.sprite = player;*/

    let scale = 0.8;
    this.width  = this.map.tilesWidth * scale;
    this.height = this.map.tilesHeight * scale;
};

// ==========
// PROPERTIES
// ==========

TableTopPlayer.prototype = new Entity();

// ==========
// GET RADIUS
// ==========

TableTopPlayer.prototype.getRadius = function (du) {
    return this.sprite.clipWidth * 0.75;
};

// =================
// RESOLVE COLLISION
// =================

TableTopPlayer.prototype.resolveCollision = function (du) {

};

// ======
// UPDATE
// ======

TableTopPlayer.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.cx = this.position.column * this.map.tilesWidth  + this.centerX;
    this.cy = this.position.row * this.map.tilesHeight + this.centerY;

    // Check collision
    if (this.isColliding()) {
        let hitEntity = this.findHitEntity();
        if (hitEntity) {
            let fun = hitEntity.resolveCollision;
            if (fun) fun.call(hitEntity);
        }
    }
    else {spatialManager.register(this)}
    
    if (this._isDeadNow) { return -1 }
};

// ======
// RENDER
// ======

TableTopPlayer.prototype.render = function (ctx) {
  // alpha for pipe effect
  ctx.globalAlpha = this.alpha;
  this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
  ctx.globalAlpha = 1;
};
