// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Location, Player, Game, GamePlayer } = initSchema(schema);

export {
  Location,
  Player,
  Game,
  GamePlayer
};