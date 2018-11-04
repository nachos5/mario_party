var mapManager = {

// "PRIVATE" DATA

currentMap : null,
startTile : { row : 0, column : 0 },
scale : null,

test0Player : null,
test1Player : null,
test2Player : null,
test3Player : null,
test4Player : null,
test5Player : null,
test6Player : null,

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
    this.test1Player = new TableTopPlayer(1);
    this.test2Player = new TableTopPlayer(2);
    this.test3Player = new TableTopPlayer(3);
    this.test4Player = new TableTopPlayer(4);
    this.test5Player = new TableTopPlayer(5);
    this.test6Player = new TableTopPlayer(6);
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
    this.test1Player.render(ctx);
    this.test2Player.render(ctx);
    this.test3Player.render(ctx);
    this.test4Player.render(ctx);
    this.test5Player.render(ctx);
    this.test6Player.render(ctx);
}

}
