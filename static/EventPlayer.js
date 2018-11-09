// ============
// EVENT PLAYER
// ============

// ===========
// CONSTRUCTOR
// ===========

function EventPlayer(id) {
    this.id = id;
    this.sprite = null;

    this.cx = null;
    this.cy = null;

    this.rotation = 0;

    this.width = null;
    this.height = null;
};

// ==========
// PROPERTIES
// ==========

EventPlayer.prototype = new Entity();

EventPlayer.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
EventPlayer.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
EventPlayer.prototype.KEY_JUMP   = ' '.charCodeAt(0);

EventPlayer.prototype.velX = 0;
EventPlayer.prototype.velY = 0;

EventPlayer.prototype.getRadius = function () {
    return this.sprite.clipWidth * 0.75;
};

EventPlayer.prototype.rememberResets = function () {
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// =====
// RESET
// =====

EventPlayer.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};

EventPlayer.prototype.accel = function (du) {
    let accelX = this.calcAccel();
    let accelY = 0;

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

    console.log("velX = " + this.velX);
    console.log("velY = " + this.velY);
    // New position = current position + aVel * time
    this.cx += this.velX * du;
    this.cy += this.velY * du;
};

EventPlayer.prototype.calcAccel = function () {
    let speed = 0;
    let maxSpeed = 5;

    //if (keys[this.KEY_JUMP])  { this.cy -= 5 }
    if (keys[this.KEY_LEFT])  { speed -= 0.5 }
    if (keys[this.KEY_RIGHT]) { speed += 0.5 }

    if (speed > maxSpeed) {return maxSpeed}
    else {return speed}
};

// ======
// UPDATE
// ======

EventPlayer.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.accel(du);

    // Check collision
    if (this.isColliding()) {
        let hitEntity = this.findHitEntity();
        if (hitEntity) {
            let canTakeHit = hitEntity.resolveCollision;
            if (canTakeHit) canTakeHit.call(hitEntity);
        }
    }
    else {spatialManager.register(this)}
};

// ======
// RENDER
// ======

EventPlayer.prototype.render = function (ctx) {
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
};
