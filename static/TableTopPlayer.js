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

    this.rememberResets();

    let scale = 0.8;
    this.width  = this.map.tilesWidth * scale;
    this.height = this.map.tilesHeight * scale;
};

// ==========
// PROPERTIES
// ==========

TableTopPlayer.prototype = new Entity();

// =======
// VICTORY
// =======

TableTopPlayer.prototype.victory = function(cx, cy) {
    this.victoryCx = cx;
    this.victoryCy = cy;
};

// ===============
// REMEMBER RESETS
// ===============

TableTopPlayer.prototype.rememberResets = function() {
    this.resetCenterX = this.centerX;
    this.resetCenterY = this.centerY;
};

// =====
// RESET
// =====

TableTopPlayer.prototype.reset = function() {
    this.centerX = this.resetCenterX;
    this.centerY = this.resetCenterY;
};

// ==========
// GET RADIUS
// ==========

TableTopPlayer.prototype.getRadius = function() {
    return this.sprite.clipWidth * 0.75;
};

// =================
// RESOLVE COLLISION
// =================

TableTopPlayer.prototype.resolveCollision = function() {

};

// ======
// UPDATE
// ======

TableTopPlayer.prototype.update = function (du) {
  console.log(this)

    spatialManager.unregister(this);

    this.cx = this.position.column * this.map.tilesWidth  + this.centerX;
    this.cy = this.position.row * this.map.tilesHeight + this.centerY;

    if (g_gameOver) {
        this.cx = this.victoryCx;
        this.cy = this.victoryCy;
    }

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
