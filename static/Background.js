// ===========
// CONSTRUCTOR
// ===========

function Background() {
    this.cx = mapManager.currentMap.mapLeft;
    this.cy = mapManager.currentMap.mapTop;

    this.width = mapManager.currentMap.mapRight - mapManager.currentMap.mapLeft;
    this.height = g_canvas.height;//mapManager.currentMap.mapBot - mapManager.currentMap.mapTop;

    this.sprite = g_sprites.background1;
    this.brick   = g_sprites.brickBlock;

    // Wall size
    this.brickLength = 13;
    this.brickHeight = 16;
    // Calculation variables
    this.wallWidth   = this.brick.width * this.brickLength;
    this.wallHeight  = this.brick.height * this.brickHeight;
        
    this.padding     = this.width * 0;
    
    // Scales
    this.brickScaleX  = this.width  / this.wallWidth;
    this.brickScaleY  = this.height / this.wallHeight;
};

Background.prototype.render = function(ctx) {;
    this.sprite.drawTopLeftFixed(ctx, this.cx, this.cy, 0, 1, 1, this.width, this.height);
}