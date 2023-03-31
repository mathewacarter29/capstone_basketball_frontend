// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const SkillLevel = {
  "BEGINNER": "BEGINNER",
  "INTERMEDIATE": "INTERMEDIATE",
  "EXPERIENCED": "EXPERIENCED",
  "ANY": "ANY"
};

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
  SkillLevel,
  Rsvp
};