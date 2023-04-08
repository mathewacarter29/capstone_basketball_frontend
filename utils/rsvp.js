import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";

async function rsvp(gameId, playerId, newRsvp) {
  const original = await DataStore.query(GamePlayer, (c) => c.and(c => [
    c.game_id.eq(gameId),
    c.player_id.eq(playerId)
  ]));

  if (original && original.rsvp != newRsvp) {
    const updatedGamePlayer = await DataStore.save(
      GamePlayer.copyOf(original, updated => {
        updated.rsvp = newRsvp
      })
    );

  }
  
}

export default rsvp;
