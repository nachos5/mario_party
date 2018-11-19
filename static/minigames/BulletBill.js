// ===========
// CONSTRUCTOR
// ===========

function BulletBill(descr) {
    this.setup(descr);
    
    this.sprite = g_sprites.bulletBill;

    this.cx = this.randomCx();
    this.cy = minigameManager.popup.innerTop;

    this.scaleX = minigameManager.popup.innerWidth/this.sizeX  / this.sprite.width;
    this.scaleY = minigameManager.popup.innerHeight/this.sizeY / this.sprite.height;


    this.isCollision = false;
    spatialManager.register(this);
}

// ==========
// PROPERTIES
// ==========

BulletBill.prototype = new Entity();

BulletBill.prototype.velX  = 0;
BulletBill.prototype.velY  = 0;
BulletBill.prototype.sizeX = 16;
BulletBill.prototype.sizeY = 16;

// =========
// RANDOM CX
// =========

BulletBill.prototype.randomCx = function() {
    return minigameManager.popup.innerLeft + Math.random() * minigameManager.popup.innerWidth;
};

// ==========
// GET RADIUS
// ==========

BulletBill.prototype.getRadius = function () {
    return this.sprite.width * 0.7;
};

// =================
// RESOLVE COLLISION
// =================

BulletBill.prototype.resolveCollision = function () {
    spatialManager.unregister(this);
    let hitEntity = this.findHitEntity();
    
    
    console.log(hitEntity);

    this.isCollision = true;
  };

// =====
// ACCEL
// =====

BulletBill.prototype.accel = function (du) {
    let accelX = 0;
    let accelY = 2;

    // Initial velocity = current velocity
    let initialVelX = this.velX;
    let initialVelY = this.velY;

    // Final velocity = iVel + acceleration * time
    let = finalVelX = initialVelX + accelX * du;
    let = finalVelY = initialVelY + accelY * du;

    // Average velocity = (iVel + fVel) / 2
    let aveVelX = (initialVelX + finalVelX) / 2;
    let aveVelY = (initialVelY + finalVelY) / 2;

    // New velocity = aVel
    this.velX = aveVelX;
    this.velY = aveVelY;

    // New position = current position + aVel * time
    this.cx += this.velX * du;
    this.cy += this.velY * du;
};

// ======
// UPDATE
// ======

BulletBill.prototype.update = function (du) {

    this.accel(du);

    if (this.isCollision || this.cy + this.getRadius() > minigameManager.popup.innerBot) { 
        return -1 
    }
};

// ======
// RENDER
// ======

BulletBill.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scaleX, this.scaleY);
};