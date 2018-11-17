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

    this.randPlayer = function() { return parseInt(Math.random() * g_playerSpritesInUse.length) };
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

EventBlocks.prototype.winner   = null;

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
    this.results1 = this.block1.update(du);
    this.results2 = this.block2.update(du);
    this.results3 = this.block3.update(du);

    // If all 3 blocks are dead, kill EventBlocks
    if (this.results1 !== undefined && this.results2 !== undefined && this.results3 !== undefined) {
        this.winner = this.block2.winner;
        this.waitTime++;
        if (this.waitTime === 100) {
            console.log(this.results1);
            console.log(this.results2);
            console.log(this.results3);
            console.log("WINNER")
            console.log(this.winner);
            //let players = entityManager._players;
            //let player1;
            //let player3;
            
            const player1    = entityManager._players.find(obj => obj.spriteID == this.results1);
            const tt_player1 = player1.tt_player;
            const player3    = entityManager._players.find(obj => obj.spriteID == this.results3);
            const tt_player3 = player3.tt_player;
            
            // Resolve winner and loser
            if (this.winner === 1 || this.winner === 2) {
                player3.coins -= 5;
                //console.log("winner 1 1st")
                //entityManager.playAnimation(1, tt_player3, repeat);
                player1.coins += 5;
                //console.log("winner 1 2nd")
                //entityManager.playAnimation(0, tt_player1);
            }
            if (this.winner === 3 || this.winner === 2) {
                player1.coins -= 5;
                //console.log("winner 3 1st")
                //entityManager.playAnimation(1, tt_player1, repeat);
                player3.coins += 5;
                //console.log("winner 3 2nd")
                //entityManager.playAnimation(0, tt_player3);
            }


            entityManager.resolveEventBlocks(this);
            // Unregister all the blocks
            spatialManager.unregister(this.block1);
            spatialManager.unregister(this.block2);
            spatialManager.unregister(this.block3);
            // Initialize closing event
            eventManager.closeBlocksEvent();
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