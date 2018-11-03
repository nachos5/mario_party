var mapManager = {

// "PRIVATE" DATA

currentMap : null,

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

init: function() {
    // Load map
    this.loadMap(0);
},

loadMap: function(map) {
    this.currentMap = new MapMaker();
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
