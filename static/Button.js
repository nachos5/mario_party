// ===========
// CONSTRUCTOR
// ===========

function Button(descr) {
    // Setup Entity object
    this.setup(descr);
    // Register for collision
    spatialManager.register(this);
}

// ==========
// PROPERTIES
// ==========

Button.prototype = new Entity();

Button.prototype.ObjectID = 'button';
Button.prototype.isReady = false;

// ==========
// GET RADIUS
// ==========

Button.prototype.getRadius = function () {
    return this.width * 0.4;
};

// =================
// RESOLVE COLLISION
// =================

Button.prototype.resolveCollision = function () {
    this.isReady = true;
    entityManager.getMyPlayer().isReady = true;
};

// ======
// UPDATE
// ======

Button.prototype.update = function(du) {

};

// ======
// RENDER
// ======

Button.prototype.render = function(ctx) {
    if (this.isReady) {
        this.offSprite.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
    }
    else {
        this.onSprite.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
    }
};
