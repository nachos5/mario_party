let stateManager = {

  no_players: 0,
  curr_player: null, // enable access to current player
  curr_player_id: 1, // we iterate through the players
  rounds_remaining: 10,
  game_room: 0,
  score_room: 0,

  // Added
  players: [],
  no_players: 0,
  gamestate: {}, // emitted from the server

  // first player starts his turn
  init: function() {
    // we wait until all existing players have been loaded into the game

    this.updateInfo();

    // we check first if we have received the game state from the server
    if (Object.keys(this.gamestate) > 0) {
      this.curr_player_id = gamestate.curr_player_id;
    }

    this.curr_player = this.findPlayer(this.curr_player_id);
    this.curr_player.tt_player.myTurn = true;

    this.game_room = new GameRoom();
    this.score_room = new ScoreRoom();
  },

  updateInfo: function() {
    this.players = entityManager._players;
    this.no_players = this.players.length;
  },

  // New player joined
  newPlayer: function(player) {
    this.players.push(player);
  },

  // finds player by id
  findPlayer: function(id) {
    this.updateInfo();
    const player = this.players.find(obj => obj.player_id == id);
    return player;
  },

  // we finalize our turn by handling final events and prepare the next turn
  finalizeTurn: function(tile) {

    // we are ready for the next turn
    this.nextTurn();
    // let the server know so he can let all other players know
    networkManager.socket.emit('next_turn');
  },

  // map manager calls this
  nextTurn: function() {
    // prevPlayer ends his turn
    const prevPlayer = this.findPlayer(this.curr_player_id);
    prevPlayer.tt_player.myTurn = false;

    // next player
    this.curr_player_id++;
    if (this.curr_player_id > this.no_players) {
      this.curr_player_id = 1;
    }

    // the next player starts his turn
    this.curr_player = this.findPlayer(this.curr_player_id);
    this.curr_player.tt_player.myTurn = true;

    // Check if places have changed
    /*this.players.sort(function(x, y){
      if(y.stars === x.stars) { return y.coins - x.coins };
      return y.stars - x.stars;
    });*/
  },

  // emit game state information
  stateIter: 0,
  emitGameState: function(du) {
    if (Math.floor(this.stateIter) == 200) {
      networkManager.socket.emit("gamestate", {
        curr_player_id: this.curr_player_id,
      });
      this.stateIter = -1;
    }
    this.stateIter++;
  },

  update: function(du) {
    this.emitGameState(du);

    this.score_room.update(du);
    this.game_room.update(du);

    // TEMP UMCOMMENT IN NEXTURN, ÞEGAR NEXTURN VIRKAR
    this.players.sort(function(x, y){
      if(y.stars === x.stars) {
        return y.coins - x.coins
      };
      return y.stars - x.stars;
    });
  },

  render: function(ctx) {
    this.game_room.render(ctx);
    this.score_room.render(ctx);
  },

}
