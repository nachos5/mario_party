var mapManager = {

// "PRIVATE" DATA

currentMap : null,
startTile : { row : 0, column : 0 },
scale : null,
mapSprite : null,
i : 0,

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

    this.currentMap.render(ctx);

    // Map variables
    let top = this.currentMap.mapTop;               // Top
    let left = this.currentMap.mapLeft;             // Left
    let mapW = this.currentMap.mapRight - left;     // Width
    let mapH = this.currentMap.mapBot - top;        // Height

    this.mapSprite = g_ctx.getImageData(left, top, mapW, mapH);

    console.log(this.mapSprite)

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

setPosition: function(player) {

},

unregisterPosition: function(entity) {

},

render: function(ctx) {
    ctx.putImageData(this.mapSprite, this.currentMap.mapLeft, this.currentMap.mapTop);
},

}
