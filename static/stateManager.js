let stateManager = {

  no_players: 0,
  curr_player: 0,
  rounds_remaining: 10,
  game_room: 0,
  score_room: 0,

  // first player starts his turn
  init: function() {
    const players = entityManager._players;
    no_players = players.length;
    players[0].myTurn = true;

    this.game_room = new GameRoom();
    this.score_room = new ScoreRoom();
  },

  nextTurn: function() {
    players[curr_player].myTurn = false;
    // next player
    curr_player++;
    if (curr_player > no_players) {
      curr_player = 0;
    }
    players[curr_player].myTurn = true;
  },

  render: function(ctx) {
    this.game_room.render(ctx);
    this.score_room.render(ctx);
  },

}
