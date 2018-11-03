
// ===========
// CONSTRUCTOR
// ===========

function MapMaker() {
    this.tiles = this.selectMap();
    
    // Designed around 16 * 16 maps
    this.mapWidth  = 16;
    this.mapHeight = 16;
    
    this.tilesRadius  = 17;     // Constant do not change
    
    let tileLength = this.tilesRadius * 2;
    
    // =====
    // SCALE
    // =====

    // Pixels for all tiles
    let mapLength = tileLength * this.mapWidth;
    // Padding
    let padding = 0;
    let paddingPercent = 0;
    // Scale according to the smaller pixel size
    if(g_canvas.width > g_canvas.height) {
        padding = g_canvas.height * paddingPercent
        this.scale = (g_canvas.height - padding) / mapLength;
    }
    else { 
        padding = g_canvas.width * paddingPercent
        this.scale = (g_canvas.width - padding) / mapLength;
    }

    // Space between tiles
    this.tilesWidth  = tileLength * this.scale;
    this.tilesHeight = tileLength * this.scale;

    // Map origin is the center
    this.mapTop  = g_canvas.height/2 - this.tilesWidth  * (0.5 + this.mapWidth/2);
    this.mapLeft = g_canvas.width/2  - this.tilesHeight * (0.5 + this.mapHeight/2);

    // ============
    // TILE SPRITES
    // ============

    // Filler tile
    this.fillerTile         = new Sprite(g_images.tiles, 35,  35, 17, 0);   // 0

    // Classic MP Spaces
    // Upper line
    this.blueTile           = new Sprite(g_images.tiles, 60,  68,  17, 0);  // 1
    this.redTile            = new Sprite(g_images.tiles, 100, 68,  17, 0);  // 2
    this.questionTile       = new Sprite(g_images.tiles, 140, 68,  17, 0);  // 3
    this.chanceTile         = new Sprite(g_images.tiles, 180, 68,  17, 0);  // 4
    this.bagTile            = new Sprite(g_images.tiles, 221, 68,  17, 0);  // 5
    // Lower Line
    this.dkTile             = new Sprite(g_images.tiles, 60,  107, 17, 0);  // 6
    this.bowserTile         = new Sprite(g_images.tiles, 100, 107, 17, 0);  // 7
    this.yStarTile          = new Sprite(g_images.tiles, 140, 107, 17, 0);  // 8
    this.bStarTile          = new Sprite(g_images.tiles, 180, 107, 17, 0);  // 9
    this.rainbowTile        = new Sprite(g_images.tiles, 221, 107, 17, 0);  // 10

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
    this.redSkipTile        = new Sprite(g_images.tiles, 160, 239, 17, 0);  // 20
    this.vsTile             = new Sprite(g_images.tiles, 200, 239, 17, 0);  // 21
    this.brawlTile          = new Sprite(g_images.tiles, 240, 239, 17, 0);  // 22

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
};

MapMaker.prototype.selectMap = function() {
    return maps.originalMap;
};

MapMaker.prototype.renderGrid = function(ctx) {
    ctx.save();
    // Horizontal
    let htop  = this.tilesHeight - this.tilesRadius;
    let hleft = this.tilesWidth - this.tilesRadius;

    // Vertical
    let vtop  = this.tilesHeight - this.tilesRadius;
    let vleft = this.tilesWidth - this.tilesRadius;

    for(let i = 0; i < this.tiles.length; i++) {
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(hleft, htop);
        ctx.lineTo(g_canvas.width, htop);
        ctx.stroke();
        ctx.closePath();

        //hleft += this.tilesWidth + this.tilesRadius;
        htop += this.tilesHeight - this.tilesRadius;
    }

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(vleft, vtop);
    ctx.lineTo(vleft, g_canvas.height);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
};

MapMaker.prototype.render = function(ctx) {
    
    // Render grid for developement
    //if(true) { this.renderGrid(ctx) };

    // Render all tiles on the map
    for(let i = 0; i < this.tiles.length; i++) {
        for(let j = 0; j < this.tiles[i].length; j++) {

            // Filler tile
            if(this.tiles[i][j] === 0) { 
                this.fillerTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }

            // Classic MP Spaces
            // Upper line
            if(this.tiles[i][j] === 1) { 
                this.blueTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 2) { 
                this.redTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 3) { 
                this.questionTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 4) { 
                this.chanceTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 5) { 
                this.bagTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            // Lower line
            if(this.tiles[i][j] === 6) { 
                this.dkTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 7) { 
                this.bowserTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 8) { 
                this.yStarTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 9) { 
                this.bStarTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 10) { 
                this.rainbowTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }

            // Mario Party 9 Spaces
            // Upper line
            if(this.tiles[i][j] === 11) { 
                this.greenTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 12) { 
                this.exclamationTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 13) { 
                this.swapTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 14) { 
                this.forwardTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 15) { 
                this.backwardTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 16) { 
                this.oneVSthreeTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            // Lower line
            if(this.tiles[i][j] === 17) { 
                this.blueNoteTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 18) { 
                this.redNoteTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 19) { 
                this.greenSkipTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 20) { 
                this.redSkipTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 21) { 
                this.vsTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 22) { 
                this.brawlTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }

            // Character Spaces
            // 1st line
            if(this.tiles[i][j] === 23) { 
                this.marioTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 24) { 
                this.luigiTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 25) { 
                this.peachTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 26) { 
                this.flowerTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            // 2nd line
            if(this.tiles[i][j] === 27) { 
                this.yoshiTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 28) { 
                this.bowtieTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 29) { 
                this.warioTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 30) { 
                this.waluigiTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            // 3rd line
            if(this.tiles[i][j] === 31) { 
                this.redToadTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 32) { 
                this.pinkToadTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 33) { 
                this.booTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 34) { 
                this.bulletBillTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale);
            }

            // Extra Spaces
            if(this.tiles[i][j] === 35) { 
                this.coOpTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 36) { 
                this.pinkArrowTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 37) { 
                this.yellowTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
            if(this.tiles[i][j] === 38) { 
                this.bowserJRTile.drawTile(ctx, (j+1)*this.tilesWidth + this.mapLeft, (i+1)*this.tilesHeight + this.mapTop, 0, this.scale); 
            }
        }
    }
};