// ===========
// CONSTRUCTOR
// ===========

function EventBlock(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = g_sprites.eventBlock;
};

EventBlock.prototype = new Entity();

// ======
// UPDATE
// ======

EventBlock.prototype.update = function(du) {

};

// ======
// RENDER
// ======

EventBlock.prototype.render = function(ctx) {
    this.sprite.drawTopLeftFixed(ctx, this.cx, this.cy, 0, 1, 1, this.width, this.height);
};