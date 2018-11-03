
// ===========
// CONSTRUCTOR
// ===========

function OriginalMap(ctx) {
    this.width = 16;
    this.height = 16;

    this.tiles = this.setupTiles();

    this.setupGrid(ctx);
    //this.populateTiles(ctx, this.tiles);
};

OriginalMap.prototype.setupTiles = function() {
    return [                                                    // Row:
        [1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 0
        [1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 1
        [1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 2
        [1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 3
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 4
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 5
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 6
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 7
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 8
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 9
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 10
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 11
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 12
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 13
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 14
        [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],  // 15
    ] // 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15
};

OriginalMap.prototype.setupGrid = function(ctx) {
    //85 width
    //48 height
    //ctx.save();


};

OriginalMap.prototype.populateTiles = function(ctx, tiles) {
    let blueTile = new Sprite(g_images.tiles, 60, 68, 17);

    for(let i = 0; i < tiles.length; i++) {
        for(let j = 0; j < tiles[i].length; j++) {
            if(tiles[i][j] === 2) { blueTile.drawTile(ctx, i*85, j*48, 0); };
        }
    }
};