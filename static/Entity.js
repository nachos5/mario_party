// ==========
// CONSTRUCTOR
// ===========

function Entity() {};

// =====
// SETUP
// =====

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();

    // I am not dead yet!
    this._isDeadNow = false;
};

// ============
// SET POSITION
// ============

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

// ============
// GET POSITION
// ============

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

// =====================
// SET PREVIOUS POSITION
// =====================

Entity.prototype.setPrevPos = function(cx, cy) {
  this.cxPrev = cx;
  this.cyPrev = cy;
}

// =====================
// GET PREVIOUS POSITION
// =====================

Entity.prototype.getPrevPos = function() {
  return{posX: this.cxPrev, posY: this.cyPrev};
}

// ==========
// GET RADIUS
// ==========

Entity.prototype.getRadius = function () {
    return 0;
};

// ==============
// GET SPATIAL ID
// ==============

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

// ===============
// FIND HIT ENTITY
// ===============

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// ============
// IS COLLIDING
// ============

Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

// ====
// KILL
// ====

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};
