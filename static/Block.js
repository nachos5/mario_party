// ===========
// CONSTRUCTOR
// ===========

function Block(descr) {
    // Setup Entity object
    this.setup(descr);
    // Random Icon
    this.icon = this.random();
    // Register for collision
    spatialManager.register(this);
}

// ==========
// PROPERTIES
// ==========

Block.prototype = new Entity();

Block.prototype.results  = null;
Block.prototype.iconIter = 0;

// ==========
// GET RADIUS
// ==========

Block.prototype.getRadius = function () {
    return this.width * 0.65;
};

// =================
// RESOLVE COLLISION
// =================

Block.prototype.resolveCollision = function () {
    if (this.results === null && stateManager.curr_player.my_player) {
        this.results = g_itemSprites[this.icon].id;
    }
};

// ======
// UPDATE
// ======

Block.prototype.update = function(du) {

    if (this.results === null && this.iconIter % 4 == 0) {
        this.icon = this.random();
        this.iconIter = 0;
    }

    this.iconIter++;

    // Let EventBlocks know that the results are in
    if(this.results !== null) {
        return this.results;
    }
};

// ======
// RENDER
// ======

Block.prototype.render = function(ctx) {

    // Base Block
    this.block.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);

    // Item Block
    if(g_itemSprites[this.icon].type === 'clipped') {
        g_itemSprites[this.icon].sp.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
    }
    else {
        g_itemSprites[this.icon].sp.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
    }
};
