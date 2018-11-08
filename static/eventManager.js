// =================================================== //
/* this manager includes all the events by tile number
   example: to call event 36 you do: eventManager[36](); */
// =================================================== //

/* IF WE HAVE NON-INSTANT EVENTS IT'S IMPORTANT TO SET mapManager.eventIsRunning
   TO FALSE WHEN THEY ARE DONE */

// check step function in the map manager

// our event manager object
let eventManager = {
  eventIter: 0,
  // events that require no animation
  instant_events: [36, 37, 38, 39],
  // we use this to check if our event happens mid movement
  mid_movement_events: [36, 37, 38, 39],
  // we use this to check if our event happens after the movement
  after_movement_events: [],

  eventIsInstant: function(id) {
    return this.instant_events.includes(id);
  },

  eventIsMidMovement: function(id) {
    return this.mid_movement_events.includes(id);
  },


  // ========= ARROW EVENTS ========== //
  /* the player ignores the prev position tile so we can use that to our advantage
     by setting the prev position to the tile that the arrow is not pointing at */
  // arrow up
  36: function() {
    const player = stateManager.curr_player.tt_player; // current player
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row + 1,
                                        column: currTilePos.column});
  },
  // arrow right
  37: function() {
    const player = stateManager.curr_player.tt_player; // current player
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row,
                                        column: currTilePos.column - 1});
  },
  // arrow down
  38: function() {
    const player = stateManager.curr_player.tt_player; // current player
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row - 1,
                                        column: currTilePos.column});
  },
  // arrow left
  39: function() {
    const player = stateManager.curr_player.tt_player; // current player
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row,
                                        column: currTilePos.column + 1});
  },

};