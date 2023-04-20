// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Rsvp = {
  "ACCEPTED": "ACCEPTED",
  "DECLINED": "DECLINED",
  "PENDING": "PENDING"
};

const SkillLevel = {
  "ANY": "ANY",
  "BEGINNER": "BEGINNER",
  "INTERMEDIATE": "INTERMEDIATE",
  "EXPERIENCED": "EXPERIENCED"
};

const { GamePlayer, Location, Player, Game } = initSchema(schema);

export {
  GamePlayer,
  Location,
  Player,
  Game,
  Rsvp,
  SkillLevel
};