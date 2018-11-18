// ===========
// CONSTRUCTOR
// ===========

function GameRoom() {

  // Sprites
  this.brick      = g_sprites.brickBlock;
  this.pipe       = g_sprites.backBluePipe;
  this.altPipe    = g_sprites.backYellowPipe;

  // Position
  this.cx = mapManager.mapRight;
  this.cy = 0;

  // Wall size
  this.wallWidth    = 13;
  this.wallHeight    = 26;

  // Word to display
  this.word = '  TURN';
  this.wordLength = 6;

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

  // ========================
  // GAME COLLISION VARIABLES
  // ========================

  // Dice Room
  this.diceRoomTop    = this.brickHeight * 3;
  this.diceRoomRight  = g_canvas.width   - this.brickWidth;
  this.diceRoomBot    = this.brickHeight * 12;
  this.diceRoomLeft   = g_canvas.width   - this.brickWidth * 12;

  this.diceRoomWidth  = this.diceRoomRight - this.diceRoomLeft;
  this.diceRoomHeight = this.diceRoomBot   - this.diceRoomTop; 

  // Event Room
  this.eventRoomTop   = this.brickHeight * 14;
  this.eventRoomRight = g_canvas.width   - this.brickWidth;
  this.eventRoomBot   = this.brickHeight * 23;
  this.eventRoomLeft  = g_canvas.width   - this.brickWidth * 12;

  this.eventRoomWidth  = this.eventRoomRight - this.eventRoomLeft;
  this.eventRoomHeight = this.eventRoomBot   - this.eventRoomTop;
};

// ==========
// PROPERTIES
// ==========

GameRoom.prototype.currPlayer = 0;

// Animation
GameRoom.prototype.isAnimating = 0;   // 0 = Off, 1 = opening, 2 = done, 3 = closing
GameRoom.prototype.pipeIter = 0;
GameRoom.prototype.pipePos = 0;

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
        console.log("opening -> done")
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
    }

  }
};

// ======
// RENDER
// ======

GameRoom.prototype.render = function(ctx) {
  // Current player
  g_playerSprites[this.currPlayer.spriteID].sp.drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 2, this.cy + this.brickHeight, 0, this.brickWidth * 2, this.brickHeight, 1, 1);

  // Animated Pipes
  // 4
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * (this.wallHeight - 7 - this.pipePos), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * (this.wallHeight - 7 - this.pipePos), Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);
  // 5
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * (this.wallHeight - 6 + this.pipePos), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * (this.wallHeight - 6 + this.pipePos), Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);

  if (g_useSpriteBox) this.renderSpriteBox(ctx);
};

// =============
// STATIC RENDER
// =============

GameRoom.prototype.staticRender = function(ctx) {
  // Bricks
  // Rows
  let y = this.cy;
  for (let i = 0; i < this.wallHeight; i++) {
    // Columns
    let x = this.cx;
    for (let j = 0; j < this.wallWidth; j++) {
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
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight, 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight, Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);
  // 2
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * 3, 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * 3, Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);
  // 3
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth,                        this.cy + this.brickHeight * Math.floor(this.wallHeight/2), 3*Math.PI/2,  this.altPipeScaleX, this.altPipeScaleY);
  this.altPipe.drawTopLeft(ctx, this.cx + this.brickWidth * (this.wallWidth - 1), this.cy + this.brickHeight * Math.floor(this.wallHeight/2), Math.PI/2, this.altPipeScaleX, this.altPipeScaleY, 1);

  // . Word
  g_alphSprites.Dot.drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * 5, this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);
  for(let i = 0; i < this.wordLength; i++) {
    let alph = this.word[i];
    if(this.word[i] !== ' ') {
        g_alphSprites[alph].drawClipTopLeftFixed(ctx, this.cx + this.brickWidth * (i+5), this.cy + this.brickHeight, 0, this.brickWidth, this.brickHeight, 1, 1);
    }
  }

  // =================
  // RENDER SPRITE BOX
  // =================

  GameRoom.prototype.renderSpriteBox = function(ctx) {
    // Dice Room
    ctx.beginPath();
    ctx.moveTo(this.diceRoomLeft, this.diceRoomTop);    // Top-left corner

    // Top line
    ctx.lineTo(this.diceRoomRight, this.diceRoomTop);
    ctx.stroke();

    // Right line
    ctx.lineTo(this.diceRoomRight, this.diceRoomBot);
    ctx.stroke();

    // Bot line
    ctx.lineTo(this.diceRoomLeft, this.diceRoomBot);
    ctx.stroke();

    // Left line
    ctx.lineTo(this.diceRoomLeft, this.diceRoomTop);
    ctx.stroke();

    ctx.closePath();

    // Event Room
    ctx.beginPath();
    ctx.moveTo(this.eventRoomLeft, this.eventRoomTop);    // Top-left corner

    // Top line
    ctx.lineTo(this.eventRoomRight, this.eventRoomTop);
    ctx.stroke();

    // Right line
    ctx.lineTo(this.eventRoomRight, this.eventRoomBot);
    ctx.stroke();

    // Bot line
    ctx.lineTo(this.eventRoomLeft, this.eventRoomBot);
    ctx.stroke();

    // Left line
    ctx.lineTo(this.eventRoomLeft, this.eventRoomTop);
    ctx.stroke();

    ctx.closePath();

  }
};