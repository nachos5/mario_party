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
finalStepBool: false,
diceThrow: 0,
stepIter: 0,
currTile: null,
currTilePos: null,
arrows: {up: false, right: false, down: false, left: false},

// ============
// LIST OF MAPS
// ============
// 0 = originalMap

init : function() {
    this.loadMap(1);    // Load map
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
  //this.diceThrow = 1;
  this.someoneIsMoving = true;
},

// each step on the map
step: function() {
  const player = stateManager.curr_player.tt_player; // current player
  const pos = this.getPosition(player); // position of that player on the board

  if (this.diceThrow > 0) {
    this.diceThrow--;
    const validTile = this.checkForNextValidTiles(player, pos); // get some valid adjacent tile
    // set prev position
    const prevPos = this.getPosition(player);
    this.setPrevPosition(player, {row: prevPos.row, column: prevPos.column});
    // set new position
    const validPos = {row: validTile.row, column: validTile.column};
    this.setPosition(player, validPos);


    // we check for an event on the current tile
    this.currTile = this.getTile(validPos);
    this.currTilePos = validPos;
    this.initEvent(this.currTile);
  }

  // we keep on going if we have reached the end of the dice roll
  else if (this.diceThrow == 0) {
    this.diceThrow--;
    const currTile = this.getTile(pos);
    // we handle our final event (if there is one)
    this.initEvent(currTile);
  }

  // here our turn is over and we have handled the final event so we end our turn
  else {
    this.someoneIsMoving = false; // we stop running this from the update loop
    this.stepIter = 0; // reset
    // we are ready to finalize our turn
    stateManager.finalizeTurn();
  }
},

// initalize an event (from the step function)
initEvent: function(currTile) {
  if (currTile in eventManager && eventManager.eventIsMidMovement(currTile)) {
    // if we are here, the current tile is a mid movement event
    // lets check if the event is instant or requires time
    if (eventManager.eventIsInstant(currTile)) {
      // if the event is instant we can just run it right now
      eventManager[currTile]();
    } else {
      // if the event takes time
      eventManager[currTile](true); // initial run where we can set parameters
      this.eventIsRunning = true; // used in the update loop
    }
  }
},

// get tile id
getTile: function(pos) {
  const tile = this.currentMap.tiles[pos.row][pos.column];
  return tile;
},

// get tile positions by id
getTilePositions: function(id) {
  let tilesPos = [];
  const tiles = this.currentMap.tiles;
  // we find all tiles with the given id
  for (let i in tiles) {
    for (let j in tiles[i]) {
      if (tiles[i][j] == id) {
        tilesPos.push({row: parseInt(i), column: parseInt(j)});
      }
    }
  }
  return tilesPos;
},

// checks for a valid tile to move to, and returns the position
checkForNextValidTiles: function(player, pos) {
  const row = pos.row,
        col = pos.column;
  const validTiles = [];
  const tiles = this.currentMap.tiles;
  const tile = tiles[row][col];

  // if we are on an arrow tile, we get the direction
  const arrow = this.checkIfOnArrow();

  // find valid tiles
  // up
  if (row > 0 && tiles[row - 1][col] != 0) {
    if (arrow == "no_arrow" || arrow == "up")
      validTiles.push({row: row - 1, column: col});
  }
  // right
  if (col < tiles.length - 1 && tiles[row][col + 1] != 0) {
    if (arrow == "no_arrow" || arrow == "right")
      validTiles.push({row: row, column: col + 1});
  }
  // down
  if (row < tiles.length - 1 && tiles[row + 1][col] != 0) {
    if (arrow == "no_arrow" || arrow == "down")
      validTiles.push({row: row + 1, column: col});
  }
  // left
  if (col > 0 && tiles[row][col - 1] != 0) {
    if (arrow == "no_arrow" || arrow == "left")
      validTiles.push({row: row, column: col - 1});
  }
  // keep track of the length (it's always 1 if on an arrow tile)
    let len = validTiles.length;

    /* we don't want to back backwards if there are multiple options so we check
       if prev position is in validTiles, if so we remove it */
    if (len > 1) {
      const prevPos = player.prevPosition;
      let obj = validTiles.find(obj => obj.row == prevPos.row && obj.column == prevPos.column);
      if (obj != undefined)  {
        const i = validTiles.indexOf(obj);
        validTiles.splice(i, 1);
        len--;
      }
    }

  this.resetArrows();
  // get 1 random tile from the valid tiles
  const rand = parseInt(Math.random() * len);
  return validTiles[rand];
},

resetArrows: function() {
  this.arrows = {up: false, right: false, down: false, left: false};
},

// checks if we are on a arrow and returns the direction of the arrow
checkIfOnArrow: function() {
  for (let key in this.arrows) {
    if (this.arrows[key])
      return key;
  }
  return "no_arrow";
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
      eventManager[this.currTile](false);
    }
  };
},

render: function(ctx) {
    ctx.putImageData(this.mapSprite, this.mapLeft, this.mapTop);

    // Render grid for developement
    if(g_useGrid) {
      this.currentMap.renderGrid(ctx)
    };
},

}
