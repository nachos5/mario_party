var mapManager = {

// "PRIVATE" DATA

currentMap: null,

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

init: function() {
    // Load map
    //this.loadMap(0);
},

loadMap: function(map) {
    currentMap = new OriginalMap(g_ctx);
},

getPosition : function() {

},

registerPostion: function(entity) {
},

unregisterPosition: function(entity) {

},

render: function(ctx) {
    /*var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    //console.log(this._entities);

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;*/
}

}
