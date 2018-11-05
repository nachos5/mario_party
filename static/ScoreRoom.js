// ===========
// CONSTRUCTOR
// ===========
// TODO ÞAÐ SAMA OG GAME ROOM
function ScoreRoom() {
    
    // Sprites
    this.brick   = g_sprites.brickBlock;
    this.pipe    = g_sprites.backBluePipe;
    this.altPipe = g_sprites.backYellowPipe;
    this.number1 = g_sprites.number1;
    this.number2 = g_sprites.number2;
    this.number3 = g_sprites.number3;
    this.number4 = g_sprites.number4;
    this.number5 = g_sprites.number5;
    this.number6 = g_sprites.number6;
    this.number7 = g_sprites.number7;
    this.number8 = g_sprites.number8;
    this.number9 = g_sprites.number9;

    // Position
    this.cx = mapManager.mapRight;
    this.cy = mapManager.mapTop;
    // Wall size
    this.brickLength    = 6;
    this.brickHeight    = 16;

    // Select number to display
    this.num = 6;

    // Calculation variables
    let mapScale     = mapManager.scale;
    let roomW        = g_canvas.width - mapManager.mapRight;
    let roomH        = g_canvas.height;
    this.wallWidth   = this.brick.width * this.brickLength;
    this.wallHeight  = this.brick.height * this.brickHeight;
    
    this.padding     = roomW * 0;

    // Scales
    this.brickScaleX  = (roomW - this.padding * 2) / this.wallWidth;
    this.brickScaleY  = (roomH - this.padding * 2) / this.wallHeight;

    // Main pipe
    this.pipeScaleX  = (this.brick.width * this.brickScaleX) / this.pipe.width;
    this.pipeScaleY  = (this.brick.height * this.brickScaleY  * this.brickHeight/2)  / this.pipe.height;
    // Alt pipe
    this.altPipeScaleX = (this.brick.height * this.brickScaleY) / this.altPipe.width;
    this.altPipeScaleY = (this.brick.width * this.brickScaleX * (this.brickLength-2)/2)  / this.altPipe.height;
};

ScoreRoom.prototype.render = function(ctx) {
    // Bricks
    // Rows
    let y = this.cy;
    for(let i = 0; i < this.brickHeight; i++) {
        // Columns
        let x = this.cx + this.padding;
        for(let j = 0; j < this.brickLength; j++) {
            this.brick.drawTopLeft(ctx, x, y, 0, this.brickScaleX, this.brickScaleY);
            
            x += this.brick.width * this.brickScaleX; 
        }
        y += this.brick.height * this.brickScaleY;
    }

    // Main Pipes
    // Top
    this.pipe.drawTopLeft(ctx, this.cx, this.cy, 0, this.pipeScaleX, this.pipeScaleY);
    this.pipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy, 0, this.pipeScaleX, this.pipeScaleY);
    // Down
    this.pipe.drawTopLeft(ctx, this.cx, this.cy + (this.brick.height * this.brickHeight * this.brickScaleY), Math.PI, this.pipeScaleX, this.pipeScaleY, 1);
    this.pipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * this.brickHeight * this.brickScaleY), Math.PI, this.pipeScaleX, this.pipeScaleY, 1);

    // Alt Pipes
    // Left
    /*1*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * 1 * this.brickScaleY)                                    , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*2*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * 3 * this.brickScaleY)                                    , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (-1 + Math.floor(this.brickHeight/2)) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*4*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (1  + Math.floor(this.brickHeight/2)) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * this.brickHeight * this.brickScaleY)                     , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    // Right
    /*1*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*2*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 3 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (-1 + Math.floor(this.brickHeight/2)) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*4*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (1  + Math.floor(this.brickHeight/2)) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * this.brickHeight * this.brickScaleY)                     , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);

    // Text
    this['number'+[this.num]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (this.brickLength - 2) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0, (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
};