var mapManager = {

// "PRIVATE" DATA

currentMap : null,
startTile : { row : 0, column : 0 },
scale : null,
mapSprite : null,

// Map dimensions
mapTop : null,
mapRight : null,
mapDown : null,
mapLeft : null,

mapWidth : null,
mapHeight : null,

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

    // Render all tiles once
    this.currentMap.render(ctx);

    // Map variables
    this.mapTop     = this.currentMap.mapTop;                    // Top
    this.mapRight   = this.currentMap.mapRight;                  // Right
    this.mapDown    = this.currentMap.mapDown;                   // Down
    this.mapleft    = this.currentMap.mapLeft;                   // Left
    this.mapWidth   = this.currentMap.mapRight - this.mapLeft;   // Width
    this.mapHeight  = this.currentMap.mapBot - this.mapTop;      // Height

    // Get map image data to save memory
    this.mapSprite = g_ctx.getImageData(this.mapLeft, this.mapTop, this.mapWidth, this.mapHeight);
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
    ctx.putImageData(this.mapSprite, this.mapLeft, this.mapTop);

    // Render grid for developement
    if(g_useGrid) { this.currentMap.renderGrid(ctx) };
},

}
