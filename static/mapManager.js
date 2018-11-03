var mapManager = {

// "PRIVATE" DATA

<<<<<<< HEAD
currentMap: null,
=======
currentMap : null,
>>>>>>> 9476ee816295173b4a2dc81c8ecfd82805f6935e

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

init: function() {
    // Load map
    this.loadMap(0);
},

loadMap: function(map) {
    this.currentMap = new MapMaker(g_ctx);
},

getPosition : function() {

},

registerPostion: function(entity) {
},

unregisterPosition: function(entity) {

},

render: function(ctx) {
    this.currentMap.render(ctx);
}

}
