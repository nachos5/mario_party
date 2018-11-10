
// ===========
// CONSTRUCTOR
// ===========

function MapMaker(map) {
    this.tiles = this.selectMap(map);

    // Designed around 16 * 16 maps
    this.mapWidth  = 16;
    this.mapHeight = 16;

    let offset = 2; // Get extra space around circle
    this.tilesRadius  = 17 + offset;     // Constant do not change

    // Same width and heigth
    let tileLength = this.tilesRadius * 2;

    // =====
    // SCALE
    // =====

    // Pixels for all tiles
    let mapLength = tileLength * this.mapWidth;
    // Padding
    this.padding = 0;
    let paddingPercent = 0;
    // Scale according to the smaller pixel size of the width or height of the canvas
    if(g_canvas.width > g_canvas.height) {
        this.padding = g_canvas.height * paddingPercent
        this.scale = (g_canvas.height - this.padding) / mapLength;
    }
    else {
        this.padding = g_canvas.width * paddingPercent
        this.scale = (g_canvas.width - this.padding) / mapLength;
    }

    // Space between tiles
    this.tilesWidth  = tileLength * this.scale;     // Horizontal space
    this.tilesHeight = tileLength * this.scale;     // Vertical space

    // ======================
    // PLAYABLE WORLD BORDERS
    // ======================

    // Map origin is the center of the canvas
    this.mapTop    = g_canvas.height/2 - this.tilesWidth  * this.mapWidth/2;
    this.mapLeft   = g_canvas.width/2  - this.tilesHeight * this.mapHeight/2;

    this.mapBot    = g_canvas.height/2 + this.tilesWidth  * this.mapWidth/2;
    this.mapRight  = g_canvas.width/2  + this.tilesWidth  * this.mapWidth/2;

    // =============
    // OFFSET VALUES
    // =============

    // Correct tiles
    this.offsetW = 0.5 * this.tilesWidth;   // + 0.5 * this.tilesWidth for correct mapTop
    this.offsetH = 0.5 * this.tilesHeight;  // + 0.5 * this.tilesWidth for correct mapLeft

    this.itemScale       = 0.75;  // Scale items on vanilla tile (e.g. pipes)

    // ============
    // TILE SPRITES
    // ============

    // Background tiles [80 - 99)
    this.backGreenTile      = g_sprites.backGreenPipe;  // 80
    this.backBlueTile       = g_sprites.backBluePipe;   // 81
    this.backRedTile        = g_sprites.backRedPipe;    // 82
    this.backYellowTile     = g_sprites.backYellowPipe; // 83

    // Filler tile
    this.fillerTile         = new Sprite(g_images.tiles, 33,  33,  this.tilesRadius, 0);  // 99

    // Game tiles [60 - 80)
    // Pipes
    this.greenPipeTile      = g_sprites.greenPipe  // 60
    this.redPipeTile        = g_sprites.redPipe    // 61

    // Normal tiles [1 - 60)
    // Classic MP Spaces
    // Upper line
    this.blueTile           = new Sprite(g_images.tiles, 60,  68,  this.tilesRadius, 0);  // 1
    this.redTile            = new Sprite(g_images.tiles, 100, 68,  this.tilesRadius, 0);  // 2
    this.questionTile       = new Sprite(g_images.tiles, 140, 68,  this.tilesRadius, 0);  // 3
    this.chanceTile         = new Sprite(g_images.tiles, 180, 68,  this.tilesRadius, 0);  // 4
    this.bagTile            = new Sprite(g_images.tiles, 221, 68,  this.tilesRadius, 0);  // 5
    // Lower Line
    this.dkTile             = new Sprite(g_images.tiles, 60,  107, this.tilesRadius, 0);  // 6
    this.bowserTile         = new Sprite(g_images.tiles, 100, 107, this.tilesRadius, 0);  // 7
    this.yStarTile          = new Sprite(g_images.tiles, 140, 107, this.tilesRadius, 0);  // 8
    this.bStarTile          = new Sprite(g_images.tiles, 180, 107, this.tilesRadius, 0);  // 9
    this.rainbowTile        = new Sprite(g_images.tiles, 221, 107, this.tilesRadius, 0);  // 10

    // Mario Party 9 Spaces
    // Upper line
    this.greenTile          = new Sprite(g_images.tiles, 40,  198, this.tilesRadius, 0);  // 11
    this.exclamationTile    = new Sprite(g_images.tiles, 80,  198, this.tilesRadius, 0);  // 12
    this.swapTile           = new Sprite(g_images.tiles, 120, 198, this.tilesRadius, 0);  // 13
    this.forwardTile        = new Sprite(g_images.tiles, 160, 198, this.tilesRadius, 0);  // 14
    this.backwardTile       = new Sprite(g_images.tiles, 200, 198, this.tilesRadius, 0);  // 15
    this.oneVSthreeTile     = new Sprite(g_images.tiles, 240, 198, this.tilesRadius, 0);  // 16
    // Lower line
    this.blueNoteTile       = new Sprite(g_images.tiles, 40,  238, this.tilesRadius, 0);  // 17
    this.redNoteTile        = new Sprite(g_images.tiles, 80,  238, this.tilesRadius, 0);  // 18
    this.greenSkipTile      = new Sprite(g_images.tiles, 120, 238, this.tilesRadius, 0);  // 19
    this.redSkipTile        = new Sprite(g_images.tiles, 160, 239, this.tilesRadius, 0);  // 20
    this.vsTile             = new Sprite(g_images.tiles, 200, 239, this.tilesRadius, 0);  // 21
    this.brawlTile          = new Sprite(g_images.tiles, 240, 239, this.tilesRadius, 0);  // 22

    // Character Spaces
    // 1st line
    this.marioTile          = new Sprite(g_images.tiles, 304,  64, this.tilesRadius, 0);  // 23
    this.luigiTile          = new Sprite(g_images.tiles, 343,  64, this.tilesRadius, 0);  // 24
    this.peachTile          = new Sprite(g_images.tiles, 382,  64, this.tilesRadius, 0);  // 25
    this.flowerTile         = new Sprite(g_images.tiles, 421,  64, this.tilesRadius, 0);  // 26
    // 2nd line
    this.yoshiTile          = new Sprite(g_images.tiles, 304, 103, this.tilesRadius, 0);  // 27
    this.bowtieTile         = new Sprite(g_images.tiles, 343, 103, this.tilesRadius, 0);  // 28
    this.warioTile          = new Sprite(g_images.tiles, 382, 103, this.tilesRadius, 0);  // 29
    this.waluigiTile        = new Sprite(g_images.tiles, 421, 103, this.tilesRadius, 0);  // 30
    // 3rd line
    this.redToadTile        = new Sprite(g_images.tiles, 304, 142, this.tilesRadius, 0);  // 31
    this.pinkToadTile       = new Sprite(g_images.tiles, 343, 142, this.tilesRadius, 0);  // 32
    this.booTile            = new Sprite(g_images.tiles, 382, 142, this.tilesRadius, 0);  // 33
    this.bulletBillTile     = new Sprite(g_images.tiles, 421, 142, this.tilesRadius, 0);  // 34

    // Extra Spaces
    this.coOpTile           = new Sprite(g_images.tiles, 305, 237, this.tilesRadius, 0);  // 35
    this.pinkArrowTile      = new Sprite(g_images.tiles, 343, 237, this.tilesRadius, 0);  // 36-UP  37-Right  38-Down  39-Left
    this.yellowTile         = new Sprite(g_images.tiles, 382, 236, this.tilesRadius, 0);  // 40
    this.bowserJRTile       = new Sprite(g_images.tiles, 421, 236, this.tilesRadius, 0);  // 41
};

MapMaker.prototype.selectMap = function(map) {
  switch(map) {
    case 0: return maps.originalMap;
    case 1: return maps.gullaTestMap;
  }
};

MapMaker.prototype.renderGrid = function(ctx) {
    ctx.save();
    // Values to shuffle
    let nextTop = this.mapTop;
    let nextLeft = this.mapLeft;

    // Horizontal line
    for(let i = 0; i < this.tiles.length + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(this.mapLeft, nextTop);
        ctx.lineTo(this.mapRight, nextTop);
        ctx.stroke();
        ctx.closePath();

        nextTop += this.tilesHeight;
    }
    // Vertical line
    for(let i = 0; i < this.tiles.length + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nextLeft, this.mapTop);
        ctx.lineTo(nextLeft, this.mapBot);
        ctx.stroke();
        ctx.closePath();

        nextLeft += this.tilesWidth;
    }
};

MapMaker.prototype.render = function(ctx) {
    // Render all tiles on the map
    for(let i = 0; i < this.tiles.length; i++) {
        for(let j = 0; j < this.tiles[i].length; j++) {

            // Background tiles
            if(this.tiles[i][j] === 80) {
                this.backGreenTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale * 0.01);
            }
            if(this.tiles[i][j] === 81) {
                this.backBlueTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 82) {
                this.backRedTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 83) {
                this.backYellowTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }

            // Filler tile
            if(this.tiles[i][j] === 99) {
                this.fillerTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }

            // Pipes
            if(this.tiles[i][j] === 60) {
                this.fillerTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
                this.greenPipeTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale * this.itemScale);
            }
            if(this.tiles[i][j] === 61) {
                this.fillerTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
                this.redPipeTile.drawCentredAt(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale * this.itemScale);
            }


            // Classic MP Spaces
            // Upper line
            if(this.tiles[i][j] === 1) {
                this.blueTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 2) {
                this.redTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 3) {
                this.questionTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 4) {
                this.chanceTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 5) {
                this.bagTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // Lower line
            if(this.tiles[i][j] === 6) {
                this.dkTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 7) {
                this.bowserTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 8) {
                this.yStarTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 9) {
                this.bStarTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 10) {
                this.rainbowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }

            // Mario Party 9 Spaces
            // Upper line
            if(this.tiles[i][j] === 11) {
                this.greenTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 12) {
                this.exclamationTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 13) {
                this.swapTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 14) {
                this.forwardTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 15) {
                this.backwardTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 16) {
                this.oneVSthreeTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // Lower line
            if(this.tiles[i][j] === 17) {
                this.blueNoteTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 18) {
                this.redNoteTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 19) {
                this.greenSkipTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 20) {
                this.redSkipTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 21) {
                this.vsTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 22) {
                this.brawlTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }

            // Character Spaces
            // 1st line
            if(this.tiles[i][j] === 23) {
                this.marioTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 24) {
                this.luigiTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 25) {
                this.peachTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 26) {
                this.flowerTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // 2nd line
            if(this.tiles[i][j] === 27) {
                this.yoshiTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 28) {
                this.bowtieTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 29) {
                this.warioTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 30) {
                this.waluigiTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // 3rd line
            if(this.tiles[i][j] === 31) {
                this.redToadTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 32) {
                this.pinkToadTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 33) {
                this.booTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 34) {
                this.bulletBillTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }

            // Extra Spaces
            if(this.tiles[i][j] === 35) {
                this.coOpTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // Arrow Up
            if(this.tiles[i][j] === 36) {
                this.pinkArrowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            // Arrow Right
            if(this.tiles[i][j] === 37) {
                this.pinkArrowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, Math.PI/2, this.scale);
            }
            // Arrow Down
            if(this.tiles[i][j] === 38) {
                this.pinkArrowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, Math.PI, this.scale);
            }
            // Arrow Left
            if(this.tiles[i][j] === 39) {
                this.pinkArrowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, Math.PI * 1.5, this.scale);
            }
            if(this.tiles[i][j] === 40) {
                this.yellowTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
            if(this.tiles[i][j] === 41) {
                this.bowserJRTile.drawTile(ctx, (j+1)*this.tilesWidth - this.offsetW + this.mapLeft, (i+1)*this.tilesHeight - this.offsetH + this.mapTop, 0, this.scale);
            }
        }
    }
};
