// ===========
// CONSTRUCTOR
// ===========

function EventBlocks(descr) {
    // Setup Entity object
    this.setup(descr);
    
    // =======
    // Sprites
    // =======

    this.eventBlock     = g_sprites.eventBlock;
    this.coin           = g_sprites.coinAni1;
    this.star           = g_sprites.star;
    // Players
    this.mario          = g_sprites.mario;
    this.luigi          = g_sprites.luigi;
    this.pinkPeach      = g_sprites.pinkPeach;
    this.yoshi          = g_sprites.yoshi;
    this.wario          = g_sprites.wario;
    this.yellowPeach    = g_sprites.yellowPeach;

    // ==============
    // SIZE VARIABLES
    // ==============

    this.itemWidth = this.width * 0.65;
    this.itemHeight = this.height * 0.65;

    this.cx = this.x + this.width/2;
    this.cy = this.y + this.height/2;

    // =============
    // CONTROL PANEL
    // =============

    this.playerIcon1   = 'yellowPeach';                         // Block 1
    this.itemIcon      = { item : 'coin', clipped : true };     // Block 2
    this.playerIcon2   = 'yoshi';                               // Block 3
    
    // X position offset
    this.widthOffset1 = this.brickWidth * 2.5;
    this.widthOffset2 = this.brickWidth * 5.5;
    this.widthOffset3 = this.brickWidth * 8.5;
    // Y position offset
    this.heightOffset = this.brickHeight * 18;
};

// ==========
// PROPERTIES
// ==========

EventBlocks.prototype = new Entity();

// ======
// UPDATE
// ======

EventBlocks.prototype.update = function(du) {

};

// ======
// RENDER
// ======

EventBlocks.prototype.render = function(ctx) {
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset1, this.y + this.heightOffset, 0, 1, 1, this.width, this.height);
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset2, this.y + this.heightOffset, 0, 1, 1, this.width, this.height);
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset3, this.y + this.heightOffset, 0, 1, 1, this.width, this.height);
    
    // Items
    this[this.playerIcon1].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset1, this.cy + this.heightOffset, 0, this.itemWidth, this.itemHeight);

    this[this.playerIcon2].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset3, this.cy + this.heightOffset, 0, this.itemWidth, this.itemHeight);
    
    if(this.itemIcon.clipped === true) {
        this[this.itemIcon.item].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset, 0, this.itemWidth, this.itemHeight);
    }
    else {
        this[this.itemIcon.item].drawCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset, 0, this.itemWidth, this.itemHeight);
    }
    
};