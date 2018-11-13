// ===========
// CONSTRUCTOR
//      BOOL = 1 - IS NORMAL
//      BOOL = 2 - IS CLIPPED SQUARE
//      BOOL = 1 - IS CLIPPED CIRCLE
// ===========

function Sprite(image, cx=0, cy=0, radius=0, bool=1, cWidth, cHeight) {
    this.image = image;

    if(bool === 1) {
        this.width = image.width;
        this.height = image.height;
        this.scale = 1;
    }
    else if(bool === 2) {
        this.cx = cx;
        this.cy = cy;
        this.clipWidth = cWidth;
        this.clipHeight = cHeight;
    }
    else {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
    }
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image,
                  x, y);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation=0, scale=this.scale) {
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image,
                  -w/2, -h/2);

    ctx.restore();
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation=0) {

    // Get "screen width"
    var sw = g_canvas.width;

    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);

    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;

    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);

    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};

// ============================================
// DRAW TOP LEFT FIXED - FIXED WIDTH AND HEIGHT
// ============================================

Sprite.prototype.drawCentredAtFixed = function (ctx, cx, cy, rotation=0, width, height, flip=0, scaleX=1, scaleY=1) {
    ctx.save();
    // Center of the sprite
    ctx.translate(cx, cy);
    // Rotate in radians
    ctx.rotate(rotation);
    // Scale image
    if(flip === 0) {  ctx.scale(scaleX,scaleY)  }
    else if(flip === 1) {  ctx.scale(-scaleX,scaleY)  }
    else if(flip === 2) {  ctx.scale(scaleX,-scaleY)  };
    // Draw sprite at it's center point
    ctx.drawImage(this.image, -width/2, -height/2, width, height);

    ctx.restore();
};

// =============
// DRAW TOP LEFT
// =============

// Draw object at the top left corner
Sprite.prototype.drawTopLeft = function (ctx, cx, cy, rotation=0, scaleX=1, scaleY=1, flip=0) {
    ctx.save();
    // Center of the sprite
    ctx.translate(cx, cy);
    // Rotate in radians
    ctx.rotate(rotation);
    // Scale image
    if(flip === 0) {  ctx.scale(scaleX,scaleY)  }
    else if(flip === 1) {  ctx.scale(-scaleX,scaleY)  }
    else if(flip === 2) {  ctx.scale(scaleX,-scaleY)  };
    // Draw sprite at it's center point
    ctx.drawImage(this.image, 0, 0);
    ctx.restore();
};

// ============================================
// DRAW TOP LEFT FIXED - FIXED WIDTH AND HEIGHT
// ============================================

Sprite.prototype.drawTopLeftFixed = function (ctx, cx, cy, rotation=0, scaleX=1, scaleY=1, width, height) {
    ctx.save();
    // Center of the sprite
    ctx.translate(cx, cy);
    // Rotate in radians
    ctx.rotate(rotation);
    // Scale image
    ctx.scale(scaleX,scaleY);
    // Draw sprite at it's center point
    ctx.drawImage(this.image, 0, 0, width, height);

    ctx.restore();
};

// ==================================
// DRAW TILE - SQUARE, CLIPPED OBJECT
// ==================================

Sprite.prototype.drawTile = function (ctx, x, y, rotation, scale=1) {
    ctx.save();
    let r = this.radius * 2;

    ctx.translate(x, y);       // coords on canvas
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    ctx.drawImage(this.image,
                    this.cx-r/2, this.cy-r/2,   // clip x, y coords
                    r, r,           // width, height of clipped img
                    -r/2, -r/2,     // center coords
                    r, r);          // width, height of image, strech

    ctx.restore();
};

// ============
// DRAW CLIPPED 
// ============

Sprite.prototype.drawClipped = function (ctx, x, y, rotation=0, scaleX=1, scaleY=1) {
    ctx.save();
    let cW = this.clipWidth * 2;
    let cH = this.clipHeight * 2;

    ctx.translate(x, y);       // coords on canvas
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    ctx.drawImage(this.image,
                    this.cx-cW/2, this.cy-cH/2,   // clip x, y coords
                    cW, cH,           // width, height of clipped img
                    -cW/2, -cH/2,     // center coords                    
                    cW, cH);          // width, height of image, strech

    ctx.restore();
};

// ========================================================
// DRAW CLIP TOP LEFT FIXED - WITH A FIXED WIDTH AND HEIGHT
// ========================================================

Sprite.prototype.drawClipTopLeftFixed = function (ctx, x, y, rotation, width, height, scaleX=1, scaleY=1) {
    ctx.save();
    let cW = this.clipWidth * 2;
    let cH = this.clipHeight * 2;

    ctx.translate(x, y);       // coords on canvas
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    ctx.drawImage(this.image,
                    this.cx-cW/2, this.cy-cH/2,   // clip x, y coords
                    cW, cH,           // width, height of clipped img
                    0, 0,     // Top left coords
                    width, height);          // width, height of image, strech

    ctx.restore();
};

// =======================================================
// DRAW CLIP CENTRED FIXED - WITH A FIXED WIDTH AND HEIGHT
// =======================================================

Sprite.prototype.drawClipCentredAtFixed = function (ctx, x, y, rotation, width, height, scaleX=1, scaleY=1) {
    ctx.save();
    let cW = this.clipWidth * 2;
    let cH = this.clipHeight * 2;

    ctx.translate(x, y);       // coords on canvas
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    ctx.drawImage(this.image,
                    this.cx-cW/2, this.cy-cH/2,   // clip x, y coords
                    cW, cH,           // width, height of clipped img
                    -width/2, -height/2,     // Top left coords
                    width, height);          // width, height of image, strech

    ctx.restore();
};