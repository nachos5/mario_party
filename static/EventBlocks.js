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

EventBlocks.prototype.waitTime = 0;

// ==========
// GET PRESET
// ==========

EventBlocks.prototype.getPreset = function(preset) {
    // Create preset 1
    if (preset === 1) {
        this.block1 = new Block({
            random : this.randItem,

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
            random : this.randItem,

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
            random : this.randItem,

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

    // If all 3 blocks are dead, kill EventBlocks
    if (this.results1 != null && this.results2 != null && this.results3 != null) {
        this.waitTime++;
        if (this.waitTime === 100) {
            // Current player variables
            const player    = stateManager.curr_player;

            // Resolve winner and loser
            let coinAmount = 5;
            let starAmount = 1;

            if (stateManager.curr_player.my_player) {
                let pCoins = player.coins;
                let pStars = player.stars;
                let coinMulti = 1;
                let starMulti = 0;
                let r1 = this.results1;
                let r2 = this.results2;
                let r3 = this.results3;
/*
                if (this.results1 === this.results2 && this.results1 === this.results3) {
                    // Item box -> coin
                    if (this.results1 === 0) {
                        stateManager.updateCollectable(player, 'coin', coinAmount);
                        animationManager.generateMapAnimation('coinDown', coinAmount);
                    }
                    // Item box -> star
                    if (this.results2 === 1) {
                        stateManager.updateCollectable(player, 'star', starAmount);
                        animationManager.generateMapAnimation('starDown', starAmount);
                    }
                    // Item box -> bowser
                    if (this.results3 === 2) {
                        coinAmount *= 2;  // Bowser takes double
                        if (pCoins < coinAmount) coinAmount = pCoins;

                        stateManager.updateCollectable(player, 'coin', -coinAmount);

                        if (coinAmount !== 0) {
                            animationManager.generateMapAnimation('coinUp', coinAmount);
                        } else {
                          stateManager.animation_is_running = false;
                        }
                    }
                    else
                      stateManager.animation_is_running = false;
                }*/


                // Coin
                if ((r1 === 0 && (r2 === 0 || r3 === 0)) || (r2 === 0 && (r1 === 0 || r3 === 0)) || (r3 === 0 && (r1 === 0 || r2 === 0))) {
                    coinMulti = 2;
                    if (r1 === 0 && r2 === 0 && r3 === 0) coinMulti = 3;   
                    stateManager.updateCollectable(player, 'coin', coinAmount    * coinMulti);
                    animationManager.generateMapAnimation('coinDown', coinAmount * coinMulti);
                }
                // Star
                if ((r1 === 1 && (r2 === 1 || r3 === 1)) || (r2 === 1 && (r1 === 1 || r3 === 1)) || (r3 === 1 && (r1 === 1 || r2 === 1))) {
                    starMulti = 0;
                    if (r1 === 1 && r2 === 1 && r3 === 1) starMulti = 1;

                    if (starMulti !== 0) {
                        stateManager.updateCollectable(player, 'star', starAmount    * starMulti);
                        animationManager.generateMapAnimation('starDown', starAmount * starMulti);
                    } else {
                        stateManager.animation_is_running = false;
                    }
                }
                // Bowser
                if ((r1 === 2 && (r2 === 2 || r3 === 2)) || (r2 === 2 && (r1 === 2 || r3 === 2)) || (r3 === 2 && (r1 === 2 || r2 === 2))) {
                    coinMulti = 3;
                    if (r1 === 2 && r2 === 2 && r3 === 2) coinMulti = 4;
                    if (pCoins < coinAmount * coinMulti) coinAmount = pCoins;

                    if (coinAmount !== 0) {
                        stateManager.updateCollectable(player, 'coin', -coinAmount * coinMulti);
                        animationManager.generateMapAnimation('coinUp', coinAmount * coinMulti);
                    } else {
                        stateManager.animation_is_running = false;
                    }
                }
                else
                  stateManager.animation_is_running = false;
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
