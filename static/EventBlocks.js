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
    this.arrow          = g_sprites.arrow;
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
    
    // ===============
    // BLOCK VARIABLES
    // ===============

    let players = ['mario', 'luigi', 'pinkPeach', 'yoshi', 'wario', 'yellowPeach'];
    let randomPlayer = function() { return parseInt(Math.random() * players.length) };

    // =============
    // CONTROL PANEL
    // =============

    this.playerIcon1   = players[randomPlayer()];               // Block 1
    this.itemIcon      = { item : 'coin', clipped : true };     // Block 2
    this.playerIcon2   = players[randomPlayer()];               // Block 3
    // Loser -> Block 1 or 3
    // Tie -> 2
    this.results        = 2;

    // Animation
    this.arrowIter = 0;
    this.arrowPos = 0;
    
    // X position offset
    this.widthOffset1 = this.brickWidth * 2.5;
    this.widthOffset2 = this.brickWidth * 5.5;
    this.widthOffset3 = this.brickWidth * 8.5;
    // Y position offset
    this.heightOffset1 = this.brickHeight * 16.5;
    this.heightOffset2 = this.brickHeight * 18;
    this.heightOffset3 = this.brickHeight * 19.5;
};

// ==========
// PROPERTIES
// ==========

EventBlocks.prototype = new Entity();

// ======
// UPDATE
// ======

EventBlocks.prototype.update = function(du) {
    if (g_useAnimation) {
        
        if(this.results !== undefined) {

            // Arrow animation
            // Increment arrow every 10th frame
            if (this.arrowIter % 6 == 0) {
            this.arrowPos += 0.15;
            }
            this.arrowIter++;
            // Restart
            if(this.arrowIter === 66) {
                this.arrowPos = 0;
                this.arrowIter = 0;
            };
        }
    }
    if(false) { return  -1};
};

// ======
// RENDER
// ======

EventBlocks.prototype.render = function(ctx) {
    // Arrows
    if(this.results === 1 || this.results ===2) {
        this.arrow.drawCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset2 - (this.brickHeight * this.arrowPos), 0, this.itemWidth, this.itemHeight);
    }
    if(this.results === 3 || this.results ===2) {
        this.arrow.drawCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset2 + (this.brickHeight * this.arrowPos), Math.PI, this.itemWidth, this.itemHeight);
    }

    // Blocks
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset1, this.y + this.heightOffset2, 0, 1, 1, this.width, this.height);    // Block 1
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset2, this.y + this.heightOffset2, 0, 1, 1, this.width, this.height);    // Block 2
    this.eventBlock.drawTopLeftFixed(ctx, this.x + this.widthOffset3, this.y + this.heightOffset2, 0, 1, 1, this.width, this.height);    // Block 3
    
    // Block Items
    // Block 1
    this[this.playerIcon1].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset1, this.cy + this.heightOffset2, 0, this.itemWidth, this.itemHeight);
    
    // Block 2
    if(this.itemIcon.clipped === true) {
        this[this.itemIcon.item].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset2, 0, this.itemWidth, this.itemHeight);
    }
    else {
        this[this.itemIcon.item].drawCentredAtFixed(ctx, this.cx + this.widthOffset2, this.cy + this.heightOffset2, 0, this.itemWidth, this.itemHeight);
    }

    // Block 3
    this[this.playerIcon2].drawClipCentredAtFixed(ctx, this.cx + this.widthOffset3, this.cy + this.heightOffset2, 0, this.itemWidth, this.itemHeight);
    
};