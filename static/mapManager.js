// ===========
// MAP MANAGER
// ===========

var mapManager = {

// Map variables
mapTop : null,
mapRight : null,
mapDown : null,
mapLeft : null,

mapWidth : null,
mapHeight : null,

scale : null,
mapSprite : null,   // Image date of the map

// Private
currentMap : null,
background: null,                     // Background behind map
startTile : { row : 0, column : 0 },  // Player starting tile

// Misc
eventIsRunning: false,
someoneIsMoving: false,
finalStepBool: false,
diceThrow: 0,
stepIter: 0,
currTile: null,
currTilePos: null,
arrows: {up: false, right: false, down: false, left: false},

// List of Maps
// 0 = originalMap

// =========
// INITALIZE
// =========

init : function() {
    this.loadMap(1);
},

// ========
// LOAD MAP
// ========

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

// =============
// READY TO MOVE
// =============

/* after our dice roll we run this to enable player movement and also to
   keep track of the value we got */
readyToMove: function(diceThrow) {
  this.diceThrow = diceThrow;
  this.someoneIsMoving = true;
},

// ====
// STEP
// ====

// each step on the map
step: function() {
  const player = stateManager.curr_player.tt_player; // current player
  const pos = this.getPosition(player); // position of that player on the board

  if (this.diceThrow > 0) {
    this.diceThrow--;
    // change die side
    entityManager.getDie().side_sprite(this.diceThrow);
      networkManager.socket.emit("die_sprite", this.diceThrow);
    // get some valid adjacent tile
    const validTile = this.checkForNextValidTiles(player, pos);
    // set prev position
    const prevPos = this.getPosition(player);
    this.setPrevPosition(player, {row: prevPos.row, column: prevPos.column});
    // set new position
    const validPos = {row: validTile.row, column: validTile.column};
    this.setPosition(player, validPos);

    // we check for an event on the current tile
    this.currTile = this.getTile(validPos);
    this.currTilePos = validPos;
    // play audio
    this.tileSound(this.currTile);
    // event only runs if it is an mid movement event
    this.initEvent(this.currTile, eventManager.eventIsMidMovement(this.currTile));
    // if we are on a blue tile, we check if there is a star on it
    if (this.currTile == 01) {
      this.checkForStar();
    }
  }

  // we keep on going if we have reached the end of the dice roll
  else if (this.diceThrow == 0) {
    this.diceThrow--;
    this.currTile = this.getTile(pos);
    // we handle our final event (if there is one)
    this.initEvent(this.currTile, true);
  }

  // here our turn is over and we have handled the final event so we end our turn
  else {
    if (!this.eventIsRunning) {
      // change die side to 0
      entityManager.getDie().side_sprite(0);
      networkManager.socket.emit("die_sprite", 0);
      this.someoneIsMoving = false; // we stop running this from the update loop
      this.stepIter = 0; // reset
      // we are ready to finalize our turn
      stateManager.finalizeTurn();
    };
  }
},

tileSound: function(tileId) {
  switch(tileId) {
    case 36: audioManager.playAndEmit("arrow", 0, false, 0.5); break;
    case 37: audioManager.playAndEmit("arrow", 0, false, 0.5); break;
    case 38: audioManager.playAndEmit("arrow", 0, false, 0.5); break;
    case 39: audioManager.playAndEmit("arrow", 0, false, 0.5); break;
    default: audioManager.playAndEmit("movement", 0, false, 0.5); break;
  };
},
// ===============
// INITALIZE EVENT
// ===============

// initalize an event (from the step function)
initEvent: function(currTile, condition) {
  if (currTile in eventManager && condition) {
    // if we are here, the current tile is a mid movement event
    // lets check if the event is instant or requires time
    if (eventManager.eventIsInstant(currTile)) {
      // if the event is instant we can just run it right now
      eventManager[currTile]();
      this.eventIsRunning = false;
    } else {
      // if the event takes time
      eventManager[currTile](true); // initial run where we can set parameters
      this.eventIsRunning = true; // used in the update loop
    }
  }
},

// ========
// GET TILE
// ========

// get tile id
getTile: function(pos) {
  const tile = this.currentMap.tiles[pos.row][pos.column];
  return tile;
},

setCurrTile: function(pos) {
  this.currTile = this.getTile(pos);
},
// =================
// GET TILE POSITION
// =================

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

// ==========================
// CHECK FOR NEXT VALID TILES
// ==========================

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
    const checkArrow = this.arrowOnTile({row: row - 1, column: col});
    if ((arrow == "no_arrow" && checkArrow != "down") || arrow == "up")
      validTiles.push({row: row - 1, column: col});
  }
  // right
  if (col < tiles.length - 1 && tiles[row][col + 1] != 0) {
    const checkArrow = this.arrowOnTile({row: row, column: col + 1});
    if ((arrow == "no_arrow" && checkArrow != "left") || arrow == "right")
      validTiles.push({row: row, column: col + 1});
  }
  // down
  if (row < tiles.length - 1 && tiles[row + 1][col] != 0) {
    const checkArrow = this.arrowOnTile({row: row + 1, column: col});
    if ((arrow == "no_arrow" && checkArrow != "up") || arrow == "down")
      validTiles.push({row: row + 1, column: col});
  }
  // left
  if (col > 0 && tiles[row][col - 1] != 0) {
    const checkArrow = this.arrowOnTile({row: row, column: col - 1});
    if ((arrow == "no_arrow" && checkArrow != "right") || arrow == "left")
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

swapTiles: function(tilePos1, tilePos2) {
  // get ids
  const tile1 = this.getTile(tilePos1);
  const tile2 = this.getTile(tilePos2);
  // swap ids
  this.currentMap.tiles[tilePos1.row][tilePos1.column] = tile2;
  this.currentMap.tiles[tilePos2.row][tilePos2.column] = tile1;
  // swap sprites
},
// ============
// RESET ARROWS
// ============

resetArrows: function() {
  this.arrows = {up: false, right: false, down: false, left: false};
},

// =================
// CHECK IF ON ARROW
// =================

// checks if we are on a arrow and returns the direction of the arrow
checkIfOnArrow: function() {
  for (let key in this.arrows) {
    if (this.arrows[key])
      return key;
  }
  return "no_arrow";
},

// return the arrow position if there is an arrow on the tile
arrowOnTile: function(pos) {
  const tileId = this.currentMap.tiles[pos.row][pos.column];
  if (tileId == 36) return "up";
  else if (tileId == 37) return "right";
  else if (tileId == 38) return "down";
  else if (tileId == 39) return "left";
  else return "no_arrow";
},


// ===========
// STAR STUFF
// ===========

checkForStar: function() {
  const player = stateManager.curr_player;
  const player_pos = mapManager.getPosition(player.tt_player);
  const star_pos = entityManager.getStar().getTilePosition();
  // the check
  if (star_pos.row == player_pos.row && star_pos.column == player_pos.column) {
    // we run a star event
    this.initEvent("buyStar", true);
  }
},

moveStar: function(rand=true) {
  // get all blue tiles
  const blueTiles = this.getTilePositions(01);
  let blueTilePos = null;
  // we pick one tile at random
  if (rand)
    blueTilePos = blueTiles[parseInt(Math.random() * blueTiles.length)];
  // not random
  else
    blueTilePos = blueTiles[parseInt(blueTiles.length / 2)];

  // set star to that tiles position
  entityManager.getStar().setTilePosition(blueTilePos);

  // emit to the server
  networkManager.emit("starPos", blueTilePos);
},




// ======
// UPDATE
// ======

update: function(du) {
  /* moving animation for tabletop players
     readyToMove sets this value to true */
  if (this.someoneIsMoving) {
    // we only move while no event is running
    if (!this.eventIsRunning) {
      // we run this every 20th frame
      if (Math.floor(this.stepIter) % 20 == 0) {
        this.step();
      }
      this.stepIter++;
      // this.stepIter += du; test more
    } else {
      // if an event is running and no animation going on
      if (!entityManager._isAnimation) {
        if (eventManager.buy_star)
          eventManager["buyStar"]();
        else
          eventManager[this.currTile]();
      }
    }
  };
},

// ======
// RENDER
// ======

render: function(ctx) {
    ctx.putImageData(this.mapSprite, this.mapLeft, this.mapTop);

    // Render grid for developement
    if(g_useGrid) {
      this.currentMap.renderGrid(ctx)
    };
},

}
