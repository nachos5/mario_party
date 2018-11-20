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

    this.results1 = null;
    this.results2 = null;
    this.results3 = null;

    this.results1_server_bool = false;
    this.results2_server_bool = false;
    this.results3_server_bool = false;

    this.winner = null;
    this.waitTime = 0;
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

    if (this.results1 != null && stateManager.curr_player.my_player) {
      networkManager.emit("results1", this.results1);
    }
    if (this.results2 != null && stateManager.curr_player.my_player) {
      networkManager.emit("results2", this.results2);
    }
    if (this.results3 != null && stateManager.curr_player.my_player) {
      networkManager.emit("results3", this.results3);
    }

    if (!this.results1_server_bool) {
      this.results1 = this.block1.update(du);
    } else {
      this.results1 = this.results1_server;
      this.block1.icon = this.results1;
    }
    if (!this.results2_server_bool) {
      this.results2 = this.block2.update(du);
    } else {
      this.results2 = this.results2_server;
      this.block2.icon = this.results2;
    }
    if (!this.results3_server_bool) {
      this.results3 = this.block3.update(du);
    } else {
      this.results3 = this.results3_server;
      this.block3.icon = this.results3;
    }
    //console.log(this.results1);
    // If all 3 blocks are dead, kill EventBlocks
    if (this.results1 !== undefined && this.results2 !== undefined && this.results3 !== undefined) {
        this.winner = this.block2.winner;
        this.waitTime++;
        if (this.waitTime === 100) {
            // Player variables
            const player1    = entityManager._players.find(obj => obj.spriteID == this.results1);
            const tt_player1 = player1.tt_player;
            const player3    = entityManager._players.find(obj => obj.spriteID == this.results3);
            const tt_player3 = player3.tt_player;

            // Resolve winner and loser
            let coinAmount = 10;
            let starAmount = 1;

            if (stateManager.curr_player.my_player) {
            // Item box -> coin
              if (this.results2 === 0) {
                  if (this.winner === 1 || this.winner === 2) {
                      stateManager.updateCollectable(player1, 'coin', coinAmount);
                      animationManager.generateMapAnimation('coinDown', coinAmount, tt_player1);
                      stateManager.updateCollectable(player3, 'coin', -coinAmount);
                      animationManager.generateMapAnimation('coinUp', coinAmount, tt_player3);
                  }
                  if (this.winner === 3 || this.winner === 2) {
                      stateManager.updateCollectable(player3, 'coin', coinAmount);
                      animationManager.generateMapAnimation('coinDown', coinAmount, tt_player3);
                      stateManager.updateCollectable(player1, 'coin', -coinAmount);
                      animationManager.generateMapAnimation('coinUp', coinAmount, tt_player1);
                  }
              }
              // Item box -> star
              if (this.results2 === 1) {
                  if (this.winner === 1 || this.winner === 2) {
                      stateManager.updateCollectable(player1, 'star', starAmount);
                      animationManager.generateMapAnimation('starDown', starAmount, tt_player1);
                      stateManager.updateCollectable(player3, 'star', -starAmount);
                      animationManager.generateMapAnimation('starUp', starAmount, tt_player3);
                  }
                  if (this.winner === 3 || this.winner === 2) {
                      stateManager.updateCollectable(player3, 'star', starAmount);
                      animationManager.generateMapAnimation('starDown', starAmount, tt_player3);
                      stateManager.updateCollectable(player1, 'star', -starAmount);
                      animationManager.generateMapAnimation('starUp', starAmount, tt_player1);
                  }
              }
              // Item box -> bowser
              if (this.results2 === 2) {
                  if (this.winner === 1 || this.winner === 2) {
                      stateManager.updateCollectable(player3, 'coin', -coinAmount);
                      animationManager.generateMapAnimation('coinUp', coinAmount, tt_player3);
                  }
                  if (this.winner === 3 || this.winner === 2) {
                      stateManager.updateCollectable(player1, 'coin', -coinAmount);
                      animationManager.generateMapAnimation('coinUp', coinAmount, tt_player1);
                  }
              }
            }

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
