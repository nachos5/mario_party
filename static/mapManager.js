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

eventIsRunning: false,
someoneIsMoving: false,
diceThrow: 0,
stepIter: 0,
currTile: null,
currTilePos: null,

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

/* after our dice roll we run this to enable player movement and also to
   keep track of the value we got */
readyToMove: function(diceThrow) {
  this.diceThrow = diceThrow;
  this.someoneIsMoving = true;
},

// each step on the map
step: function() {
  const player = stateManager.curr_player.tt_player; // current player
  const pos = this.getPosition(player); // position of that player on the board
  const validTile = this.checkForNextValidTiles(player, pos); // get some valid adjacent tile
  const prevPos = this.getPosition(player);
  this.setPrevPosition(player, {row: prevPos.row, column: prevPos.column});
  const validPos = {row: validTile.row, column: validTile.column};
  this.setPosition(player, validPos);
  this.diceThrow--;

  if (this.diceThrow > 0) {
    // we check for an event on the current tile
    this.currTile = this.getTile(validPos);
    this.currTilePos = validPos;
    if (this.currTile in eventManager && eventManager.eventIsMidMovement(this.currTile)) {
      // if we are here, the current tile is a mid movement event
      // lets check if the event is instant or requires time
      if (eventManager.eventIsInstant(this.currTile)) {
        // if the event is instant we can just run it right now
        eventManager[this.currTile]();
      } else {
        // if the event takes time
        this.eventIsRunning = true; // used in the update loop
      }
    }
  }

  // we keep on going if we have reached the end of the dice roll
  if (this.diceThrow <= 0) {
    this.someoneIsMoving = false; // we stop running this from the update loop
    this.stepIter = 0; // reset
    // lets get our final tile type (for events)
    const tile = this.getTile(validPos);
    // we are ready to finalize our turn
    stateManager.finalizeTurn(tile);
  }
},

getTile: function(pos) {
  const tile = this.currentMap.tiles[pos.row][pos.column];
  return tile;
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

update: function(du) {
  /* moving animation for tabletop players
     readyToMove sets this value to true */
  if (this.someoneIsMoving) {
    // we only move while no event is running
    if (!this.eventIsRunning) {
      // we run this every 40th frame
      if (Math.floor(this.stepIter) % 40 == 0) {
        this.step();
      }
      this.stepIter++;
      // this.stepIter += du; test more
    } else {
      // if an event is running
      eventManager[this.currTile]();
    }
  }
},

render: function(ctx) {
    ctx.putImageData(this.mapSprite, this.mapLeft, this.mapTop);

    // Render grid for developement
    if(g_useGrid) {
      this.currentMap.renderGrid(ctx)
    };
},

}
