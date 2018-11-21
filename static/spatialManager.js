// ===============
// SPATIAL MANAGER
// ===============

let spatialManager = {

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)
_entities : [],


// ==================
// GET NEW SPATIAL ID
// ==================

getNewSpatialID : function() {
    return this._nextSpatialID++;
},

// ========
// REGISTER
// ========

register: function(entity) {
    const pos = entity.getPos(),
        spatialID = entity.getSpatialID(),
        radius = entity.getRadius();

    // Register the entity
    this._entities[spatialID] = {entity : entity, posX : pos.posX, posY : pos.posY,
            radius : radius};
},

// ==========
// UNREGISTER
// ==========

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // unregister the entity (we don't want "self-collision")
    this._entities[spatialID] = {posX : null, posY : null, radius : null};

},

// ====================
// FIND ENTITY IN RANGE
// ====================

findEntityInRange: function(posX, posY, radius) {
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


// ======
// UPDATE
// ======
update: function(du) {
  if (eatClick("spatial")) {
    let hitEntity = this.findEntityInRange(g_mouseX, g_mouseY, 1);

    // Call object that was clicked on
    if (hitEntity) {
      let fun = hitEntity.resolveCollision;
      if (fun) fun.call(hitEntity);
    }
  }
},


// ======
// RENDER
// ======

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
