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
CharacterSelection.prototype.owner = 0;     // Owner of this button, to resolve render updates

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
    // Update scoreboard
    stateManager.updateImageDate('scoreRoom');
    
    this.isSelected = true;

    // Update menu
    if (this.owner === 'menu') menuManager.updateImageData();
};

// ====
// LOCK
// ====

CharacterSelection.prototype.lock = function() {
    this.isLocked = true;
};

// ======
// UNLOCK
// ======

CharacterSelection.prototype.unlock = function() {
    this.isLocked = false;
};

// ======
// UPDATE
// ======

CharacterSelection.prototype.update = function(du) {
};

// ======
// RENDER
// ======

CharacterSelection.prototype.render = function(ctx) {
    if (g_useSpriteBox) this.renderSpriteBox();
};

// ==============
// DYNAMIC RENDER
// ==============

CharacterSelection.prototype.dynamicRender = function(ctx) {
    if (this.isSelected || this.isLocked) { ctx.globalAlpha = this.alpha }
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.scaleX, this.scaleY);

    ctx.globalAlpha = 1;
};

// =================
// RENDER SPRITE BOX
// =================

CharacterSelection.prototype.renderSpriteBox = function() {
    ctx.beginPath();
    ctx.moveTo(this.cx - this.width/2, this.cy - this.height/2);    // Top-left corner

    // Top line
    ctx.lineTo(this.cx + this.width/2, this.cy - this.height/2);
    ctx.stroke();

    // Right line
    ctx.lineTo(this.cx + this.width/2, this.cy + this.height/2);
    ctx.stroke();

    // Bot line
    ctx.lineTo(this.cx - this.width/2, this.cy + this.height/2);
    ctx.stroke();

    // Left line
    ctx.lineTo(this.cx - this.width/2, this.cy - this.height/2);
    ctx.stroke();
    ctx.closePath();
}