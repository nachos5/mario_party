// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, cx=0, cy=0, radius=0, bool=1) {
    this.image = image;

    if(bool) {
        this.width = image.width;
        this.height = image.height;
        this.scale = 1;
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
    if (rotation === undefined) rotation = 0;

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

// =============
// DRAW TOP LEFT
// =============

// Draw object at the top left corner
Sprite.prototype.drawTopLeft = function (ctx, cx, cy, rotation=0, scaleX=1, scaleY=1) {
    ctx.save();
    // Center of the sprite
    ctx.translate(cx, cy);
    // Rotate in radians
    ctx.rotate(rotation);
    // Scale image
    ctx.scale(scaleX,scaleY);
    // Draw sprite at it's center point
    ctx.drawImage(this.image, 0, 0);
    ctx.restore();
};

Sprite.prototype.drawBackground = function (ctx, cx, cy, rotation=0, scaleX=1, scaleY=1, width, height) {
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
