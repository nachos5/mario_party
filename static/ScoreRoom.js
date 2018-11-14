// ===========
// CONSTRUCTOR
// ===========

function ScoreRoom() {
    // Sprites
    this.brick   = g_sprites.brickBlock;
    this.pipe    = g_sprites.backGreenPipe;
    this.altPipe = g_sprites.backRedPipe;
    // Star
    this.star  = g_sprites.star;

    // Wall size
    this.wallWidth    = 13;
    this.wallHeight    = 26;

    // Word to display
    this.word = ' ROUND ';
    this.wordLength = 7;

    // Brick scale
    this.brickScaleX = mapManager.mapLeft / (this.brick.width * this.wallWidth);    // roomWidth / wallWidth
    this.brickScaleY = g_canvas.height    / (this.brick.height * this.wallHeight);  // roomHeight / wallHeight

    // Real values
    this.brickWidth  = this.brick.width  * this.brickScaleX;
    this.brickHeight = this.brick.height * this.brickScaleY;

    // Vertical pipe scale
    this.pipeScaleX = this.brickWidth / this.pipe.width;
    this.pipeScaleY = (this.brickHeight  * this.wallHeight/2) / this.pipe.height;
    // Horizontal pipe scale
    this.altPipeScaleX = this.brickHeight / this.altPipe.width;
    this.altPipeScaleY = (this.brickWidth * (this.wallWidth - 1.5)/2) / this.altPipe.height;   // - 1.5 instead of 2 to let the ovelap to cover up holes
};

// ==========
// PROPERTIES
// ==========

ScoreRoom.prototype.spriteID = 0;
ScoreRoom.prototype.players = 0;

// Position
ScoreRoom.prototype.cx = 0;
ScoreRoom.prototype.cy = 0;

// Animation
ScoreRoom.prototype.coinIter = 0;
ScoreRoom.prototype.coinFrame = 0;

// Round number
ScoreRoom.prototype.num1 = 0;
ScoreRoom.prototype.num2 = 0;

// ======
// UPDATE
// ======

ScoreRoom.prototype.update = function(du) {
    if (g_useAnimation) {
        // Coin animation
        // Swap frames every 10th frame
        if (this.coinIter % 6 == 0) {
            this.coinFrame += 1;
        }
        this.coinIter++;
        // Restart
        if(this.coinIter === 30) {
            this.coinFrame = 0;
            this.coinIter = 0;
        };
    }
};

// ======
// RENDER
// ======

ScoreRoom.prototype.render = function(ctx) {
    // Round number
    g_numberSprites['num'+[this.num1]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * (this.wallWidth - 4), this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);
    g_numberSprites['num'+[this.num2]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * (this.wallWidth - 3), this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);

    for(let i = 0; i < this.players.length; i++) {
        // Coin
        g_aniSprites.coin[this.coinFrame].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 9, this.cy + this.brickHeight * (i+3), 0, this.brickWidth, this.brickHeight, 1, 1);
    }
};

// ==============
// DYNAMIC RENDER
// ==============

ScoreRoom.prototype.dynamicRender = function(ctx) {
    // 3 - Moving pipe
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * (this.players.length + 4), 3*Math.PI/2, this.altPipeScaleX, this.altPipeScaleY);
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * (this.players.length + 4), Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);

    // 1st playerSprite *00 .00
    for(let i = 0; i < this.players.length; i++) {
        // Position
        g_numberSprites['num'+[i+1]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth, this.cy + this.brickHeight * (i+3), 0, this.brickWidth, this.brickHeight, 1, 1);
        // Position letters
        let letter1 = (i < 3) ? ( (i < 2) ? ( (i < 1) ? 'S' : 'N') : 'R') : 'T';
        let letter2 = (i < 3) ? ( (i < 2) ? ( (i < 1) ? 'T' : 'D') : 'D') : 'H';
        g_alphSprites[letter1].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 2, this.cy + this.brickHeight * (i+3.4), 0, this.brickWidth/2, this.brickHeight/2, 1, 1);
        g_alphSprites[letter2].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 2.5, this.cy + this.brickHeight * (i+3.4), 0, this.brickWidth/2, this.brickHeight/2, 1, 1);
        // Player
        g_playerSprites[this.players[i].spriteID].sp.drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 4, this.cy + this.brickHeight * (i+3), 0, this.brickWidth * 2, this.brickHeight, 1, 1);
        // Star
        this.star.drawTopLeftFixed(ctx, this.cx + this.brickWidth * 7, this.cy + this.brickHeight * (i+3), 0, 1, 1, this.brickWidth, this.brickHeight);
        g_numberSprites['num'+[this.players[i].stars]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 8, this.cy + this.brickHeight * (i+3), 0, this.brickWidth, this.brickHeight, 1, 1);
        // Calculate 1st and 2nd digit of number
        let digit1 = Math.floor(this.players[i].coins / 10);
        let digit2 = this.players[i].coins % 10;
        g_numberSprites['num'+[digit1]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 10, this.cy + this.brickHeight * (i+3), 0, this.brickWidth, this.brickHeight, 1, 1);
        g_numberSprites['num'+[digit2]].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 11, this.cy + this.brickHeight * (i+3), 0, this.brickWidth, this.brickHeight, 1, 1);
    }
}

// =============
// STATIC RENDER
// =============

ScoreRoom.prototype.staticRender = function(ctx) {
    // Bricks
    // Rows
    let y = this.cy;
    for(let i = 0; i < this.wallHeight; i++) {
        // Columns
        let x = this.cx;
        for(let j = 0; j < this.wallWidth; j++) {
            this.brick.drawTopLeft(ctx, x, y, 0, this.brickScaleX, this.brickScaleY);
            x += this.brickWidth;
        }
        y += this.brickHeight;
    }

    // Vertical Pipes
    // 1
    this.pipe.drawTopLeft(ctx, this.cx, this.cy, 0, this.pipeScaleX, this.pipeScaleY);
    this.pipe.drawTopLeft(ctx, this.cx, this.cy + this.brickHeight * this.wallHeight, Math.PI, this.pipeScaleX, this.pipeScaleY, 1);
    // 2
    this.pipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy, 0, this.pipeScaleX, this.pipeScaleY);
    this.pipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * this.wallHeight, Math.PI, this.pipeScaleX, this.pipeScaleY, 1);

    // Horizontal Pipes
    // 1
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight,                             3*Math.PI/2, this.altPipeScaleX, this.altPipeScaleY);
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight,                             Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);
    // 2
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * 3,                         3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * 3,                         Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);
    // 4
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * this.wallHeight,           3*Math.PI/2, this.altPipeScaleX, this.altPipeScaleY);
    this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * this.wallHeight,           Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);

    // Word .
    for(let i = 0; i < this.wordLength; i++) {
        let alph = this.word[i];
        if(this.word[i] !== ' ') {
            g_alphSprites[alph].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * (i+1), this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);
        }
        
    }
    g_alphSprites.Dot.drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * (this.wallWidth - 5), this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);
};
