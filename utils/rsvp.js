import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";

function rsvp(status, player_id, details) {

  gameId = details.id;
  


  if (status == RSV) {
    console.log(`${gameItem.name}: RSVP Accepted`);
  } else {
    console.log(`${gameItem.name}: RSVP Rejected`);
  }
}

export default rsvp;
