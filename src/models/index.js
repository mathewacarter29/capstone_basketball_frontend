// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Rsvp = {
  "ACCEPTED": "ACCEPTED",
  "DECLINED": "DECLINED",
  "PENDING": "PENDING"
};

const { GamePlayer, Location, Player, Game } = initSchema(schema);

export {
  GamePlayer,
  Location,
  Player,
  Game,
  Rsvp
};