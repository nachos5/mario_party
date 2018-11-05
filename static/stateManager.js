let stateManager = {

  no_players: 0,
  curr_player: 0,
  rounds_remaining: 10,

  // first player starts his turn
  init: function() {
    const players = entityManager._players;
    no_players = players.length;
    players[0].myTurn = true;
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

}
