// ===========
// CONSTRUCTOR
// ===========

function EventBlocks(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Sprites
    this.eventBlock     = g_sprites.eventBlock;
    this.arrow          = g_sprites.arrow;

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

    this.randPlayer = function() { return parseInt(Math.random() * g_playerSprites.length) };
    this.randItem   = function() { return parseInt(Math.random() * g_itemSprites.length) };

    // =============
    // OFFSET VALUES
    // =============
    
    // X position offset
    this.widthOffset1 = this.brickWidth * 2.5;
    this.widthOffset2 = this.brickWidth * 5.5;
    this.widthOffset3 = this.brickWidth * 8.5;
    // Y position offset
    this.heightOffset1 = this.brickHeight * 16.5;
    this.heightOffset2 = this.brickHeight * 18;
    this.heightOffset3 = this.brickHeight * 19.5;

    // Initialize blocks
    this.getPreset(1);
    this.getPreset(2);
    this.getPreset(3);
};

// ==========
// PROPERTIES
// ==========

EventBlocks.prototype.block1 = null;
EventBlocks.prototype.block2 = null;
EventBlocks.prototype.block3 = null;

EventBlocks.prototype.results1 = null;
EventBlocks.prototype.results2 = null;
EventBlocks.prototype.results3 = null;

EventBlocks.prototype.winner = null;

EventBlocks.prototype.waitTime = 0;

// ==========
// GET PRESET
// ==========

EventBlocks.prototype.getPreset = function(preset) {
    // Create preset 1
    if (preset === 1) {
        this.block1 = new Block({
            id : 1,
            random : this.randPlayer,

            cx : this.cx + this.widthOffset1,
            cy : this.cy + this.heightOffset2,

            width : this.width,
            height : this.height,

            itemWidth : this.itemWidth,
            itemHeight : this.itemHeight,

            block : this.eventBlock,
        });
    }
    // Create preset 2
    if (preset === 2) {
        this.block2 = new Block({
            id : 2,
            random : this.randItem,

            brickHeight : this.brickHeight,
            arrow : this.arrow,
            arrowIter : 0,
            arrowPos : 0,

            cx : this.cx + this.widthOffset2,
            cy : this.cy + this.heightOffset2,

            width : this.width,
            height : this.height,

            itemWidth : this.itemWidth,
            itemHeight : this.itemHeight,

            block : this.eventBlock,
        });
    }
    // Create preset 3
    if (preset === 3) {
        this.block3 = new Block({
            id : 3,
            random : this.randPlayer,

            cx : this.cx + this.widthOffset3,
            cy : this.cy + this.heightOffset2,

            width : this.width,
            height : this.height,

            itemWidth : this.itemWidth,
            itemHeight : this.itemHeight,

            block : this.eventBlock,
        });
    }
};

// ======
// UPDATE
// ======

EventBlocks.prototype.update = function(du) {
    let status1 = this.block1.update(du);
    let status2 = this.block2.update(du);
    let status3 = this.block3.update(du);

    // If all 3 blocks are dead, kill EventBlocks
    if (status1 === -1 && status2 === -1 && status3 === -1) {
        this.waitTime++;
        if (this.waitTime === 100) {
            entityManager.resolveEventBlocks(this);
            // Unregister all the blocks
            spatialManager.unregister(this.block1);
            spatialManager.unregister(this.block2);
            spatialManager.unregister(this.block3);
            // Initialize closing event
            eventManager.closeBlocksEvent(2);
            return -1;
        }
    }
};

// ======
// RENDER
// ======

EventBlocks.prototype.render = function(ctx) {
    this.block1.render(ctx);
    this.block2.render(ctx);
    this.block3.render(ctx);
};