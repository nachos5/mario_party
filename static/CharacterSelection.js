// ===========
// CONSTRUCTOR
// ===========

function CharacterSelection(descr) {
    // Setup Entity object
    this.setup(descr);
    // Register for collision
    spatialManager.register(this);
}

// ==========
// PROPERTIES
// ==========

CharacterSelection.prototype = new Entity();

CharacterSelection.prototype.ObjectID = 'charSelection';
CharacterSelection.prototype.isSelected = false;
CharacterSelection.prototype.isLocked = false;
CharacterSelection.prototype.alpha = 0.5;

// ==========
// GET RADIUS
// ==========

CharacterSelection.prototype.getRadius = function () {
    return this.width * 0.5;
};

// =================
// RESOLVE COLLISION
// =================

CharacterSelection.prototype.resolveCollision = function () {
    if (this.isLocked) { return }

    let player = entityManager.getMyPlayer();
    player.spriteID = this.id;
    
    player.refresh();
    menuManager.refresh();

    this.isSelected = true;
};

// ======
// UPDATE
// ======

CharacterSelection.prototype.update = function(du) {
    return -1;
};

// ======
// RENDER
// ======

CharacterSelection.prototype.render = function(ctx) {
    if (this.isSelected || this.isLocked) { ctx.globalAlpha = this.alpha }
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);

    ctx.globalAlpha = 1;
};
