
// ===========
// CONSTRUCTOR
// ===========

function OriginalMap(ctx) {
    this.tiles = this.setupTiles();

    // Classic MP Spaces
    // Upper line
    this.blueTile           = new Sprite(g_images.tiles, 60,  68, 17, 0);   // 1
    this.redTile            = new Sprite(g_images.tiles, 100, 68, 17, 0);   // 2
    this.questionTile       = new Sprite(g_images.tiles, 140, 68, 17, 0);   // 3
    this.chanceTile         = new Sprite(g_images.tiles, 180, 68, 17, 0);   // 4
    this.bagTile            = new Sprite(g_images.tiles, 220, 68, 17, 0);   // 5
    // Lower Line
    this.dkTile             = new Sprite(g_images.tiles, 60,  108, 17, 0);  // 6
    this.bowserTile         = new Sprite(g_images.tiles, 100, 108, 17, 0);  // 7
    this.yStarTile          = new Sprite(g_images.tiles, 140, 108, 17, 0);  // 8
    this.bStarTile          = new Sprite(g_images.tiles, 180, 108, 17, 0);  // 9
    this.rainbowTile        = new Sprite(g_images.tiles, 220, 108, 17, 0);  // 10

    // Mario Party 9 Spaces
    // Upper line
    this.greenTile          = new Sprite(g_images.tiles, 40,  198, 17, 0);  // 11
    this.exclamationTile    = new Sprite(g_images.tiles, 80,  198, 17, 0);  // 12
    this.swapTile           = new Sprite(g_images.tiles, 120, 198, 17, 0);  // 13
    this.forwardTile        = new Sprite(g_images.tiles, 160, 198, 17, 0);  // 14
    this.backwardTile       = new Sprite(g_images.tiles, 200, 198, 17, 0);  // 15
    this.oneVSthreeTile     = new Sprite(g_images.tiles, 240, 198, 17, 0);  // 16
    // Lower line
    this.blueNoteTile       = new Sprite(g_images.tiles, 40,  238, 17, 0);  // 17
    this.redNoteTile        = new Sprite(g_images.tiles, 80,  238, 17, 0);  // 18
    this.greenSkipTile      = new Sprite(g_images.tiles, 120, 238, 17, 0);  // 19
    this.redSkipTile        = new Sprite(g_images.tiles, 160, 238, 17, 0);  // 20
    this.vsTile             = new Sprite(g_images.tiles, 200, 238, 17, 0);  // 21
    this.brawlTile          = new Sprite(g_images.tiles, 240, 238, 17, 0);  // 22

    // Character Spaces
    // 1st line
    this.marioTile          = new Sprite(g_images.tiles, 304,  64, 17, 0);  // 23
    this.luigiTile          = new Sprite(g_images.tiles, 343,  64, 17, 0);  // 24
    this.peachTile          = new Sprite(g_images.tiles, 382,  64, 17, 0);  // 25
    this.flowerTile         = new Sprite(g_images.tiles, 421,  64, 17, 0);  // 26
    // 2nd line
    this.yoshiTile          = new Sprite(g_images.tiles, 304, 103, 17, 0);  // 27
    this.bowtieTile         = new Sprite(g_images.tiles, 343, 103, 17, 0);  // 28
    this.warioTile          = new Sprite(g_images.tiles, 382, 103, 17, 0);  // 29
    this.waluigiTile        = new Sprite(g_images.tiles, 421, 103, 17, 0);  // 30
    // 3rd line
    this.redToadTile        = new Sprite(g_images.tiles, 304, 142, 17, 0);  // 31
    this.pinkToadTile       = new Sprite(g_images.tiles, 343, 142, 17, 0);  // 32
    this.booTile            = new Sprite(g_images.tiles, 382, 142, 17, 0);  // 33
    this.bulletBillTile     = new Sprite(g_images.tiles, 421, 142, 17, 0);  // 34

    // Extra Spaces
    this.coOpTile           = new Sprite(g_images.tiles, 305, 237, 17, 0);  // 35
    this.pinkArrowTile      = new Sprite(g_images.tiles, 343, 237, 17, 0);  // 36
    this.yellowTile         = new Sprite(g_images.tiles, 382, 236, 17, 0);  // 37
    this.bowserJRTile       = new Sprite(g_images.tiles, 421, 236, 17, 0);  // 38

    this.setupGrid(ctx);
    //this.populateTiles(ctx, this.tiles);
};

OriginalMap.prototype.setupTiles = function() {
    return [
        [01,  06,  11,  23,  35,  00,  00,  03,  00,  00,  00,  00,  00,  00,  00,  00],  // 0
        [02,  07,  12,  24,  36,  00,  00,  01,  00,  00,  00,  00,  00,  00,  00,  00],  // 1
        [03,  08,  13,  25,  37,  00,  00,  01,  00,  00,  00,  00,  00,  00,  00,  00],  // 2
        [04,  09,  14,  26,  38,  00,  00,  01,  00,  00,  00,  00,  00,  00,  00,  00],  // 3
        [05,  10,  15,  27,  00,  00,  00,  02,  04,  02,  05,  00,  00,  00,  00,  00],  // 4
        [00,  00,  16,  28,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 5
        [00,  00,  17,  29,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 6
        [00,  00,  18,  30,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 7
        [00,  00,  19,  31,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 8
        [00,  00,  20,  32,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 9
        [00,  00,  21,  33,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 10
        [00,  00,  22,  34,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 11
        [00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 12
        [00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 13
        [00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 14
        [00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00,  00],  // 15
    ] // 0,   1,   2,   3,   4,   5,   6,   7,   8,   9,   10,  11,  12,  13,  14,  15
};

OriginalMap.prototype.setupGrid = function(ctx) {
    //85 width
    //48 height
    //ctx.save();


};

OriginalMap.prototype.populateTiles = function(ctx, tiles) {

    for(let i = 0; i < tiles.length; i++) {
        for(let j = 0; j < tiles[i].length; j++) {
            if(tiles[i][j] === 2) { 
                console.log("bluetile");
                console.log("i+0 = " + (i+1) + " j+0 = " + (j+1));
                this.blueTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
        }
    }
};

OriginalMap.prototype.render = function(ctx) {
    
    for(let i = 0; i < this.tiles.length; i++) {
        for(let j = 0; j < this.tiles[i].length; j++) {

            // Classic MP Spaces
            // Upper line
            if(this.tiles[i][j] === 1) { 
                this.blueTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 2) { 
                this.redTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 3) { 
                this.questionTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 4) { 
                this.chanceTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 5) { 
                this.bagTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            // Lower line
            if(this.tiles[i][j] === 6) { 
                this.dkTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 7) { 
                this.bowserTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 8) { 
                this.yStarTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 9) { 
                this.bStarTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 10) { 
                this.rainbowTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }

            // Mario Party 9 Spaces
            // Upper line
            if(this.tiles[i][j] === 11) { 
                this.greenTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 12) { 
                this.exclamationTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 13) { 
                this.swapTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 14) { 
                this.forwardTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 15) { 
                this.backwardTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 16) { 
                this.oneVSthreeTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            // Lower line
            if(this.tiles[i][j] === 17) { 
                this.blueNoteTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 18) { 
                this.redNoteTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 19) { 
                this.greenSkipTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 20) { 
                this.redSkipTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 21) { 
                this.vsTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 22) { 
                this.brawlTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }

            // Character Spaces
            // 1st line
            if(this.tiles[i][j] === 23) { 
                this.marioTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 24) { 
                this.luigiTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 25) { 
                this.peachTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 26) { 
                this.flowerTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            // 2nd line
            if(this.tiles[i][j] === 27) { 
                this.yoshiTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 28) { 
                this.bowtieTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 29) { 
                this.warioTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 30) { 
                this.waluigiTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            // 3rd line
            if(this.tiles[i][j] === 31) { 
                this.redToadTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 32) { 
                this.pinkToadTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 33) { 
                this.booTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 34) { 
                this.bulletBillTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }

            // Extra Spaces
            if(this.tiles[i][j] === 35) { 
                this.coOpTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 36) { 
                this.pinkArrowTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 37) { 
                this.yellowTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
            if(this.tiles[i][j] === 38) { 
                this.bowserJRTile.drawTile(ctx, (j+1)*85, (i+1)*48, 0); 
            }
        }
    }
};