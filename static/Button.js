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
Button.prototype.owner = 0;     // Owner of this button, to resolve render updates

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
    
    // Update menu
    if (this.owner === 'menu') {
        entityManager.getMyPlayer().isReady = true;
        menuManager.updateImageData();
    }

    if (this.owner === 'buyStar') {}
};

// ======
// UPDATE
// ======

Button.prototype.update = function(du) {
    if (this.isReady) { return -1 }
};

// ======
// RENDER
// ======

Button.prototype.render = function(ctx) {
    if (this.isReady) {
        this.offSprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scaleX, this.scaleY);
    }
    else {
        this.onSprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scaleX, this.scaleY);
    }
};
