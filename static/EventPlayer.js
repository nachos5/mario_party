// ============
// EVENT PLAYER
// ============

// ===========
// CONSTRUCTOR
// ===========

function EventPlayer(id) {
    this.setup();

    this.id = id;
    this.sprite = null;

    this.cx = null;
    this.cy = null;

    this.rotation = 0;

    this.width = null;
    this.height = null;

    // 0 = diceRoom, 1 = eventRoom, 2 = minigame
    this.room = null;
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

EventPlayer.prototype.prevVelX = 0;
EventPlayer.prototype.prevVelY = 0;

EventPlayer.prototype.getRadius = function () {
    return this.sprite.clipWidth * 0.75;
};

EventPlayer.prototype.rememberResets = function () {
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// ===========
// CHANGE ROOM
// ===========

EventPlayer.prototype.changeRoom = function (room) {
    this.room = room;

    // Dice Room
    if (this.room === 0) {
        this.cx = entityManager._gameRoomcx + entityManager._gameRoomBrickWidth * 6.5;
        this.cy = entityManager._gameRoomcy + entityManager._gameRoomBrickHeight * 11;
        this.bot = stateManager.game_room.diceRoomBot;
    }
    // Event Room
    else if (this.room === 1) {
        this.cx = entityManager._gameRoomcx + entityManager._gameRoomBrickWidth * 6.5;
        this.cy = entityManager._gameRoomcy + entityManager._gameRoomBrickHeight * 22;
        this.bot = stateManager.game_room.eventRoomBot;
    }


};

// =====
// RESET
// =====

EventPlayer.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};

// =================
// IS ROOM COLLISION
// =================

EventPlayer.prototype.isRoomCollision = function () {
    if(this.room === 0) {
        if( stateManager.game_room.diceRoomTop    > this.cy - this.getRadius() ||
            stateManager.game_room.diceRoomRight  < this.cx + this.getRadius() ||
            stateManager.game_room.diceRoomBot    < this.cy + this.getRadius() ||
            stateManager.game_room.diceRoomLeft   > this.cx - this.getRadius()
        ) { return true }
        return false;
    }
    if(this.room === 1) {
        if( stateManager.game_room.eventRoomTop    > this.cy - this.getRadius() ||
            stateManager.game_room.eventRoomRight  < this.cx + this.getRadius() ||
            stateManager.game_room.eventRoomBot    < this.cy + this.getRadius() ||
            stateManager.game_room.eventRoomLeft   > this.cx - this.getRadius()
        ) { return true }
        return false;
    }
    return false;
};

// =====
// ACCEL
// =====

EventPlayer.prototype.accel = function (du) {
    let accelX = this.calcAccelX();
    let accelY = this.calcAccelY();

    // Initial velocity = current velocity
    let initialVelX = this.velX;
    let initialVelY = this.velY;

    // Final velocity = iVel + acceleration * time
    let = finalVelX = initialVelX + accelX * du;
    let = finalVelY = initialVelY + accelY * du;

    // Average velocity = (iVel + fVel) / 2
    let aveVelX = (initialVelX + finalVelX) / 2;
    let aveVelY = (initialVelY + finalVelY) / 2;

    // Fallback velocity
    this.prevVelX = this.velX;
    this.prevVelY = this.velY;

    // New velocity = aVel
    this.velX = aveVelX;
    this.velY = aveVelY;

    // Fallback position
    this.prevCx = this.cx;
    this.prevCy = this.cy;

    // New position = current position + aVel * time
    this.cx += this.velX * du;
    this.cy += this.velY * du;

    // Check for room collision
    if(this.isRoomCollision()) {
        this.velX *= - 1/8;
        this.velY = 0;
        this.cx = this.prevCx;
        this.cy = this.prevCy;
    }
};

// ============
// CALC ACCEL X
// ============

EventPlayer.prototype.calcAccelX = function () {
    let accelX = 0;
    let maxAccelX = 0.35;    // Right
    let minAccelX = -0.35;   // Left

    const accelStep = maxAccelX / 4;

    if (keys[this.KEY_LEFT] || keys[this.KEY_RIGHT]) {
        if (keys[this.KEY_LEFT]) { accelX -= accelStep }
        if (keys[this.KEY_RIGHT]) { accelX += accelStep }
    }
    else {  // Inertia
        // To prevent bouncing in place
        if ((-accelStep / 2) <= this.velX && this.velX <= (accelStep / 2)) {
            this.velX = 0;
        }
        else if (this.velX < 0) {
            accelX += accelStep / 2;
        }
        else if (this.velX > 0) {
            accelX -= accelStep / 2;
        }
    }

    if (accelX > maxAccelX) { return maxAccelX }
    if (accelX < minAccelX) { return minAccelX }
    else { return accelX }
};

// ============
// CALC ACCEL Y
// ============

EventPlayer.prototype.calcAccelY = function () {
    let gravity = entityManager._gravity;

    let accelY = 0;
    let maxAccelY = -2.5;

    if (this.velY === 0 && !(this.cy + this.getRadius() < this.bot - this.getRadius())) {
        if (eatKey(this.KEY_JUMP))  {
            this.velY = maxAccelY;
        }
    }

    // 1/4 sprite height from the ground enables gravity
    if (this.cy + this.getRadius() <= this.bot - this.getRadius()/4) {
        accelY += gravity;
    }

    return accelY;
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
            let fun = hitEntity.resolveCollision;
            if (fun) fun.call(hitEntity);
        }

        // Bounce player back
        this.velX *= - 1/8;
        this.velY = 0;
        this.cx = this.prevCx;
        this.cy = this.prevCy;
    }
    else {spatialManager.register(this)}

    if (this._isDeadNow) { return -1 }
};

// ======
// RENDER
// ======

EventPlayer.prototype.render = function (ctx) {
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
};
