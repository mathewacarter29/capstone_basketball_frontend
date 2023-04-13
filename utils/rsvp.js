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
  const original = await DataStore.query(GamePlayer, (c) => c.and(c => [
    c.game_id.eq(gameId),
    c.player_id.eq(playerId)
  ]));

  console.log("original: ", original);
  
  if (original.length > 0 && original[0].rsvp != newRsvp) {
    try {
      const updatedGamePlayer = await DataStore.save(
        GamePlayer.copyOf(original[0], updated => {
          updated.rsvp = newRsvp
        })
      );

      return true;
    }

    catch (error) {

      console.log("error saving rsvp: ", error);
      return false;
    }
  }

  // user rsvp to a game he was not invited to
  else if (original.length == 0){
    try {
      if (newRsvp == Rsvp.ACCEPTED) {
        const gamePlayer = await DataStore.save(
          new GamePlayer({
            player_id: playerId,
            game_id: gameId,
            rsvp: newRsvp,
            invited: false,
          })
        );
        console.log("game player stored: ", gamePlayer);
      }
      
    } catch (error) {
      console.log("error: ", error.message, "storing player: ", playerId);
    }
  }
  
}

export default rsvp;
