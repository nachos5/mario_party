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

    animationManager.generateTempAnimation('eventArrow');
    this.arrowAnimation = animationManager.tempAnimations.find(obj => obj.preset == 'eventArrow');
}

// ==========
// PROPERTIES
// ==========

Block.prototype = new Entity();

Block.prototype.results  = null;
Block.prototype.winner   = null;
Block.prototype.iconIter = 0;

// ==========
// GET RADIUS
// ==========

Block.prototype.getRadius = function () {
    return this.width * 0.75;
};

// =================
// RESOLVE COLLISION
// =================

Block.prototype.resolveCollision = function () {
    if (this.id === 2 && this.results === null && stateManager.curr_player.my_player) {
        animationManager.generateTempAnimation('eventArrow');
        this.results = g_itemSprites[this.icon].id;
        this.winner = parseInt(Math.random() * 3) + 1;
        networkManager.emit('block_winner', this.winner);
    }
    else if(this.results === null){
      try {
        this.results = g_playerSpritesInUse[this.icon].id;
      } catch(e) {console.log(this.icon)};
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

    // Item Block Arrows
    if (this.id === 2) {
        // Arrows
        if(this.winner === 3 || this.winner === 2) {
            this.arrow.drawCentredAtFixed(ctx, this.cx, this.cy - (this.brickHeight * this.arrowAnimation.cy), 0, this.itemWidth, this.itemHeight);
        }
        if(this.winner === 1 || this.winner === 2) {
            this.arrow.drawCentredAtFixed(ctx, this.cx, this.cy + (this.brickHeight * this.arrowAnimation.cy), Math.PI, this.itemWidth, this.itemHeight);
        }
    }

    // Base Block
    this.block.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);

    // Player Block 1
    if (this.id === 1){
      try {
        g_playerSpritesInUse[this.icon].sp.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
      } catch(e) {console.log(this.icon)};
    }
    // Item Block
    if (this.id === 2) {
        if(g_itemSprites[this.icon].type === 'clipped') {
            g_itemSprites[this.icon].sp.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
        }
        else {
            g_itemSprites[this.icon].sp.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
        }
    }
    // Player Block 2
    if (this.id === 3){
      try {
        g_playerSpritesInUse[this.icon].sp.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
      } catch(e) {console.log(this.icon)};
    }
};
