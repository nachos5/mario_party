/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    // TODO: YOUR STUFF HERE!
    return this._nextSpatialID++;
},

register: function(entity) {
    const pos = entity.getPos(),
        spatialID = entity.getSpatialID(),
        radius = entity.getRadius();
    
    // Register the entity
    this._entities[spatialID] = {entity : entity, posX : pos.posX, posY : pos.posY,
            radius : radius};
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // unregister the entity (we don't want "self-collision")
    this._entities[spatialID] = {posX : null, posY : null, radius : null};

},

// Special Register for EventBlocks
registerMulti: function(entity) {
    let pos = entity.getPos(),
        spatialID = entity.getSpatialID(),
        radius = entity.getRadius();
    
    // Item 1
    let posX1 = pos.posX + entity.widthOffset1;
    pos.posY += entity.heightOffset2;

    // Register the entity
    this._entities[spatialID] = {entity : entity, posX : posX1, posY : pos.posY,
            radius : radius};

    // Item 2
    spatialID = this.getNewSpatialID();
    let posX2 = pos.posX + entity.widthOffset2;

    // Register the entity
    this._entities[spatialID] = {entity : entity, posX : posX2, posY : pos.posY,
            radius : radius};

    // Item3
    spatialID = this.getNewSpatialID();
    let posX3 = pos.posX + entity.widthOffset3;
        
    // Register the entity
    this._entities[spatialID] = {entity : entity, posX : posX3, posY : pos.posY,
            radius : radius};
},

findEntityInRange: function(posX, posY, radius) {
    // TODO: YOUR STUFF HERE!
    for (let i in this._entities) {
      const e = this._entities[i]; // current entity attributes
          // euclidean distance between passed and current entites attributes
          const dist = util.EUdist(posX, posY, e.posX, e.posY),
          // collision threshold (distance between the center coords)
          threshold = radius + e.radius;
          
          // collision
          if (dist < threshold) {
              //console.log("COLLISION!");
              return e.entity;
            }
        }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
