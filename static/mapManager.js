var mapManager = {

// "PRIVATE" DATA

currentMap : null,
startTile : { row : 0, column : 0 },
scale : null,
mapSprite : null,
background: null,

// Map dimensions
mapTop : null,
mapRight : null,
mapDown : null,
mapLeft : null,

mapWidth : null,
mapHeight : null,

someoneIsMoving: false,
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

    // Create background
    this.background = new Background();
    this.background.render(ctx);
    // Render all tiles once
    this.currentMap.render(ctx);

    // Map variables
    this.mapTop     = this.currentMap.mapTop;                    // Top
    this.mapRight   = this.currentMap.mapRight;                  // Right
    this.mapBot     = this.currentMap.mapBot;                    // Bot
    this.mapLeft    = this.currentMap.mapLeft;                   // Left

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
  return player.position;
},

setPosition: function(player, pos) {
  player.position = {row: pos.row, column: pos.column};
},

getPrevPosition : function(player) {
  return player.prevPosition;
},

setPrevPosition: function(player, pos) {
  player.prevPosition = {row: pos.row, column: pos.column};
},

unregisterPosition: function(entity) {

},

// diceThrow amount of steps on the map
steps: function(player, diceThrow) {
  this.someoneIsMoving = true;
  let i = diceThrow;
  const time = 1000;
  const self = this;
  const interval = setInterval(function() {
    const pos = self.getPosition(player);
    const validTile = self.checkForNextValidTiles(player, pos);
    const prevPos = self.getPosition(player);
    self.setPrevPosition(player, {column: prevPos.column, row: prevPos.row});
    self.setPosition(player, {column: validTile.column, row: validTile.row});
    i--;
    if (i <= 0) {
      self.someoneIsMoving = false;
      // we are ready to handle events
      stateManager.handleEvents();
      // let the server know so he can let all other players know
      networkManager.socket.emit('next_turn');
      clearInterval(interval);
    }
  }, time);
},

// checks for a valid tile to move to, and returns the position
checkForNextValidTiles: function(player, pos) {
  const row = pos.row,
        col = pos.column;
  const validTiles = [];
  const tiles = this.currentMap.tiles;
  const tile = tiles[pos.row][pos.column];

  // find valid tiles
  if (row < tiles.length && tiles[row + 1][col] != 0)
    validTiles.push({row: row + 1, column: col});
  if (row > 0 && tiles[row - 1][col] != 0)
    validTiles.push({row: row - 1, column: col});
  if (col < tiles.length && tiles[row][col + 1] != 0)
    validTiles.push({row: row, column: col + 1});
  if (col > 0 && tiles[row][col - 1] != 0)
    validTiles.push({row: row, column: col - 1});

  // keep track of the length
    let len = validTiles.length;

  /* we don't want to back backwards if there are multiple options so we check
     if prev position is in validTiles */
  if (len > 1) {
    const prevPos = player.prevPosition;
    let obj = validTiles.find(obj => obj.row == prevPos.row && obj.column == prevPos.column);
    if (obj != undefined)  {
      const i = validTiles.indexOf(obj);
      validTiles.splice(i, 1);
      len--;
    }
  }

  // get 1 random tile from the valid tiles
  const rand = parseInt(Math.random() * len);
  return validTiles[rand];
},

render: function(ctx) {
    ctx.putImageData(this.mapSprite, this.mapLeft, this.mapTop);

    // Render grid for developement
    if(g_useGrid) { this.currentMap.renderGrid(ctx) };
},

}
