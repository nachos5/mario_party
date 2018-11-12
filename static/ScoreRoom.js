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

    // Animation
    this.coinIter = 0;
    this.coinFrame = 1;

    // Position
    this.cx = 0;
    this.cy = 0;
    // Wall size
    this.brickLength    = 13;
    this.brickHeight    = 26;

    // Select number and letter to display
    this.num1 = null;
    this.num2 = null;
    this.letter = '';
    this.word = ' ROUND ';
    this.wordLength = 7;

    // Calculation variables
    let roomW        = mapManager.mapLeft;
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
    this.altPipeScaleX = (this.brick.height * this.brickScaleY) / this.altPipe.width;7
    // - 1.5 instead of 2 to let the ovelap to cover up holes
    this.altPipeScaleY = (this.brick.width * this.brickScaleX * (this.brickLength - 1.5)/2)  / this.altPipe.height;
};

// ==========
// PROPERTIES
// ==========

ScoreRoom.prototype.spriteID = 0;
ScoreRoom.prototype.players = 0;

// ======
// UPDATE
// ======

ScoreRoom.prototype.update = function(du) {
    if (g_useAnimation) {
        // Coin animation
        // Swap frames every 10th frame
        if (this.coinIter % 6 == 0) {
            this.coinFram += 1;
        }
        this.coinIter++;
        // Restart
        if(this.coinIter === 24) {
            this.coinFram = 0;
            this.coinIter = 0;
        };
    }
};

// ======
// RENDER
// ======

ScoreRoom.prototype.render = function(ctx) {
    // Bricks
    // Rows
    let y = this.cy;
    for(let i = 0; i < this.brickHeight; i++) {
        // Columns
        let x = this.cx + this.padding;
        for(let j = 0; j < this.brickLength; j++) {
            this.brick.drawTopLeft(ctx, x, y, 0, this.brickScaleX, this.brickScaleY);
            //console.log("x = " + x + " y = " + y);
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
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (4 + this.players.length) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*4*///this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (1  + Math.floor(this.brickHeight/2)) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * this.brickHeight * this.brickScaleY)                     , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    // Right
    /*1*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*2*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 3 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (4 + this.players.length) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*4*///this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (1  + Math.floor(this.brickHeight/2)) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * this.brickHeight * this.brickScaleY)                     , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);

    // Word . ##
    for(let i = 0; i < this.wordLength; i++) {
        let alph = this.word[i];
        if(this.word[i] !== ' ') {
            g_alphSprites[alph].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (i+1) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
        }
        
    }
    g_alphSprites.Dot.drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (this.brickLength - 5) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
    g_numberSprites['num'+[this.num1]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (this.brickLength - 4) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
    g_numberSprites['num'+[this.num2]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (this.brickLength - 3) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);


    // 1st playerSprite *00 .00
    for(let i = 0; i < this.players.length; i++) {
        // Position
        g_numberSprites['num'+[i+1]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 1 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
        // Position letters
        let letter1 = (i < 3) ? ( (i < 2) ? ( (i < 1) ? 'S' : 'N') : 'R') : 'T';
        let letter2 = (i < 3) ? ( (i < 2) ? ( (i < 1) ? 'T' : 'D') : 'D') : 'H';
        g_alphSprites[letter1].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 2 * this.brickScaleX), this.cy + (this.brick.height * (i+3.4) * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX)/2, (this.brick.height * this.brickScaleY)/2, 1, 1);
        g_alphSprites[letter2].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 2.5 * this.brickScaleX), this.cy + (this.brick.height * (i+3.4) * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX)/2, (this.brick.height * this.brickScaleY)/2, 1, 1);
        // Player
        g_playerSprites[this.players[i].spriteID].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 4 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,         (this.brick.width * 2 * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
        //this.alphP.drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 4 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
        //this['number'+[this.players[i].player_id]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 5 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
        // Star
        this.star.drawTopLeftFixed(ctx, this.cx + (this.brick.width * 7 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0, 1, 1,        (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY));
        g_numberSprites['num'+[this.players[i].stars]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 8 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
        // Coin
        g_aniSprites.coin[this.coinFrame].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 9 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
        // Calculate 1st and 2nd digit of number
        let digit1 = Math.floor(this.players[i].coins / 10);
        let digit2 = this.players[i].coins % 10;
        g_numberSprites['num'+[digit1]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 10 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
        g_numberSprites['num'+[digit2]].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 11 * this.brickScaleX), this.cy + (this.brick.height * (i+3) * this.brickScaleY), 0,          (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY), 1, 1);
    }
};
