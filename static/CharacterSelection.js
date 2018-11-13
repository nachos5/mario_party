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
    let player = entityManager._players.find(player => player.my_player == true);

    //if (player.spriteID !== null) { return }
    
    player.spriteID = this.id;

    this.isSelected = true;
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
    if (this.isSelected) { ctx.globalAlpha = 0.5 }
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
    
    ctx.globalAlpha = 1;
};