import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";
import { DataStore } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";

async function rsvp(gameId, playerId, newRsvp) {
  try {
    // player's original RSVP
    const original = await DataStore.query(GamePlayer, (c) =>
      c.and((c) => [c.game_id.eq(gameId), c.player_id.eq(playerId)])
    );
    // console.log(original);

    // if the player has RSVPd before or invited
    if (original.length > 0 && original[0].rsvp != newRsvp) {
      const updatedGamePlayer = await DataStore.save(
        GamePlayer.copyOf(original[0], (updated) => {
          updated.rsvp = newRsvp;
        })
      );

      return true;
    }

    // user rsvp to a game he was not invited to
    else if (original.length == 0) {
      const gamePlayer = await DataStore.save(
        new GamePlayer({
          player_id: playerId,
          game_id: gameId,
          rsvp: newRsvp,
          invited: false,
        })
      );
      // console.log("game player stored: ", gamePlayer);
    }
  } catch (error) {
    console.log("error retrieving game player: ", error.message);
    return false;
  }
}

export default rsvp;
