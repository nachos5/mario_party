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
          radius = entity.getRadius(),
          spatialID = entity.getSpatialID();

    // register the entity
    this._entities[spatialID] = {entity : entity, posX : pos.posX, posY : pos.posY,
                                 radius : radius};

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // unregister the entity (we don't want "self-collision")
    this._entities[spatialID] = {posX : null, posY : null, radius : null};

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
    //console.log(this._entities);

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
