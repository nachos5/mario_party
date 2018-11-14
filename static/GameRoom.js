// ===========
// CONSTRUCTOR
// ===========

function GameRoom() {

  // Sprites
  this.brick      = g_sprites.brickBlock;
  this.pipe       = g_sprites.backBluePipe;
  this.altPipe    = g_sprites.backYellowPipe;

  // Animation
  this.isAnimating = 0;   // 0 = Off, 1 = opening, 2 = done, 3 = closing
  this.pipeIter = 0;
  this.pipePos = 0;
  // Position
  this.cx = mapManager.mapRight;
  this.cy = 0;
  // Wall size
  this.brickLength    = 13;
  this.brickHeight    = 26;

  // Select number and letter to display
  this.num = null;
  this.letter = 'P'
  this.word = '  TURN';
  this.wordLength = 6;

  // Calculation variables
  let roomW = g_canvas.width - mapManager.mapRight;
  let roomH = g_canvas.height;
  this.wallWidth = this.brick.width * this.brickLength;
  this.wallHeight = this.brick.height * this.brickHeight;

  this.padding = roomW * 0;

  // Scales
  this.brickScaleX = (roomW - this.padding * 2) / this.wallWidth;
  this.brickScaleY = (roomH - this.padding * 2) / this.wallHeight;

  // Main pipe
  this.pipeScaleX = (this.brick.width * this.brickScaleX) / this.pipe.width;
  this.pipeScaleY = (this.brick.height * this.brickScaleY * this.brickHeight / 2) / this.pipe.height;
  // Alt pipe
  this.altPipeScaleX = (this.brick.height * this.brickScaleY) / this.altPipe.width;
  // - 1.5 instead of 2 to let the ovelap to cover up holes
  this.altPipeScaleY = (this.brick.width * this.brickScaleX * (this.brickLength - 1.5) / 2) / this.altPipe.height;

  // ========================
  // GAME COLLISION VARIABLES
  // ========================

  // Dice Room
  this.diceRoomTop    = 0              + (this.brick.height * this.brickScaleY) * 3;
  this.diceRoomRight  = g_canvas.width - (this.brick.width  * this.brickScaleX) * 1;
  this.diceRoomBot    = 0              + (this.brick.height * this.brickScaleY) * 12;
  this.diceRoomLeft   = g_canvas.width - (this.brick.width  * this.brickScaleX) * 12;

  // Event Room
  this.eventRoomTop    = 0              + (this.brick.height * this.brickScaleY) * 14;
  this.eventRoomRight  = g_canvas.width - (this.brick.width  * this.brickScaleX) * 1;
  this.eventRoomBot    = 0              + (this.brick.height * this.brickScaleY) * 23;
  this.eventRoomLeft   = g_canvas.width - (this.brick.width  * this.brickScaleX) * 12;
};

// ==========
// PROPERTIES
// ==========

GameRoom.prototype.currPlayer = 0;

// ======
// UPDATE
// ======

GameRoom.prototype.update = function(du) {
  if(g_useAnimation) {

    // Pipe animation
    if((this.pipeIter < 144 && this.isAnimating === 1) || (this.pipeIter > -144 && this.isAnimating === 3)) {
      if(this.pipeIter % 6 === 0) {  // Swap frames every 10th frame
        // Open
        if(this.isAnimating === 1) {
          if(this.pipeIter < 96) { this.pipePos += 0.125 }
          else { this.pipePos += 0.25 };
        }
        // Close
        if(this.isAnimating === 3) {
          if(this.pipeIter > -96) { this.pipePos -= 0.125 }
          else { this.pipePos -= 0.25 };
        }
      }
      if(this.isAnimating === 1) this.pipeIter++;  // Open
      if(this.isAnimating === 3) this.pipeIter--;  // Close

      // Stop opening
      if(this.pipeIter >= 144) {
        if(this.isAnimating === 1) {this.isAnimating = 2};  // opening -> done
        eventManager.blocksEvent();
      }
    }
    // Start closing
    if(!eventManager.isBlocksEvent && this.isAnimating === 2) {
      this.pipeIter = 0;
      if(this.isAnimating === 2) {this.isAnimating = 3}   // done -> closing
    }
    // Restart
    if(this.pipeIter <= -144 && this.isAnimating === 3) { 
      this.pipeIter = 0;
      this.isAnimating = 0; // closing -> off
      eventManager.closeBlocksEvent(0);
    }

  }
};

// ======
// RENDER
// ======

GameRoom.prototype.render = function(ctx) {
  // Bricks
  // Rows
  let y = this.cy;
  for (let i = 0; i < this.brickHeight; i++) {
    // Columns
    let x = this.cx + this.padding;
    for (let j = 0; j < this.brickLength; j++) {
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
    // LEFT
    /*1*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * 1 * this.brickScaleY)                                    , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*2*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * 3 * this.brickScaleY)                                    , 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (0 + Math.floor(this.brickHeight/2)) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    
    // Animated Pipes
    /*4*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (this.brickHeight - 7 - this.pipePos) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * this.brickScaleX),                          this.cy + (this.brick.height * (this.brickHeight - 6 + this.pipePos) * this.brickScaleY), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);

    // RIGHT
    /*1*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*2*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * 3 * this.brickScaleY)                                    , Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*3*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (0 + Math.floor(this.brickHeight/2)) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);

    // Animated Pipes
    /*4*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (this.brickHeight - 7 - this.pipePos) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);
    /*5*/this.altPipe.drawTopLeft(ctx, this.cx + (this.brick.width * (this.brickLength - 1) * this.brickScaleX), this.cy + (this.brick.height * (this.brickHeight - 6 + this.pipePos) * this.brickScaleY), Math.PI/2,    this.altPipeScaleX, this.altPipeScaleY, 1);

    // PlayerSprite . Word
    g_playerSprites[this.currPlayer.spriteID].sp.drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 2 * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,         (this.brick.width * 2 * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
    g_alphSprites.Dot.drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * 5 * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
    for(let i = 0; i < this.wordLength; i++) {
        let alph = this.word[i];
        if(this.word[i] !== ' ') {
          g_alphSprites[alph].drawClipTopLeftFixed(ctx, this.cx + (this.brick.width * (i+5) * this.brickScaleX), this.cy + (this.brick.height * 1 * this.brickScaleY), 0,         (this.brick.width * this.brickScaleX), (this.brick.height * this.brickScaleY),      1, 1);
        }
    }
};
