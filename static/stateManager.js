let stateManager = {

  no_players: 0,
  curr_player: null, // enable access to current player
  curr_player_index: 0, // we iterate through the players
  rounds_remaining: 10,
  game_room: 0,
  score_room: 0,

  // first player starts his turn
  init: function() {
    const players = entityManager._players;
    this.no_players = players.length;
    this.curr_player = players[0];
    this.curr_player.tt_player.myTurn = true;

    this.game_room = new GameRoom();
    this.score_room = new ScoreRoom();
  },

  nextTurn: function() {
    this.curr_player = players[this.curr_player_index];
    this.curr_player.tt_player.myTurn = false;
    // next player
    this.curr_player_index++;
    if (this.curr_player_index > this.no_players) {
      this.curr_player_index = 0;
    }

    this.curr_player = this.players[curr_player_index];
    this.curr_player.tt_player.myTurn = true;
  },

  render: function(ctx) {
    this.game_room.render(ctx);
    this.score_room.render(ctx);
  },

}
