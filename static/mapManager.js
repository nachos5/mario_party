var mapManager = {

// "PRIVATE" DATA

currentMap : null,
startTile : { row : 0, column : 0 },
scale : null,

test0Player : null,

// ============
// LIST OF MAPS
// ============
// 0 = originalMap

init : function() {
    this.loadMap(0);    // Load map
},

loadMap : function(map) {
    this.currentMap = new MapMaker(map);
    this.scale = this.currentMap.scale;

    this.test0Player = new TableTopPlayer(0);
},

getMap : function() {
    return this.currentMap;
},

getStartPosition : function() {
    return this.startTile;
},

getPosition : function(player) {

},

setPostion: function(player) {

},

unregisterPosition: function(entity) {

},

render: function(ctx) {
    this.currentMap.render(ctx);

    this.test0Player.render(ctx);
},

}
