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
CharacterSelection.prototype.alpha = 1;

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
    
    player.spriteID = this.id;
    player.refresh();
    //player.eventPlayer.sprite = this.id;

    if (this.isSelected) {
        this.alpha = 1;
        this.isSelected = false;
    }

    this.alpha = 0.5;
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
    if (this.isSelected) { ctx.globalAlpha = this.alpha }
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);
    
    ctx.globalAlpha = 1;
};