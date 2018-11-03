
// ===========
// CONSTRUCTOR
// ===========

function OriginalMap(ctx) {
    this.tiles = this.setupTiles();

    this.blueTile       = new Sprite(g_images.tiles, 60, 68, 17, 0);    // 1
    this.redTile        = new Sprite(g_images.tiles, 100, 68, 17, 0);   // 2
    this.questionTile   = new Sprite(g_images.tiles, 140, 68, 17, 0);   // 3
    this.chanceTile     = new Sprite(g_images.tiles, 180, 68, 17, 0);   // 4
    this.bagTile        = new Sprite(g_images.tiles, 220, 68, 17, 0);   // 5

    this.setupGrid(ctx);
    //this.populateTiles(ctx, this.tiles);
};

OriginalMap.prototype.setupTiles = function() {
    return [
        [2,  0,  0,  2,  2,  0,  0,  3,  0,  0,  0,  0,  0,  0,  0,  0],  // 0
        [2,  0,  0,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],  // 0
        [0,  2,  0,  2,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],  // 2
        [0,  2,  0,  2,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],  // 3
        [0,  0,  0,  0,  0,  0,  0,  2,  4,  2,  5,  0,  0,  0,  0,  0],  // 4
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 5
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 6
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 7
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 8
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 9
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 00
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 00
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 02
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 03
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 04
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  // 05
    ] // 0,  0,  2,  3,  4,  5,  6,  7,  8,  9,  00, 00, 02, 03, 04, 05
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
        }
    }
};