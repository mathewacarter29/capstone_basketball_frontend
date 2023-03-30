import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum Rsvp {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  PENDING = "PENDING"
}



type EagerGamePlayer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GamePlayer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly player_id: string;
  readonly game_id: string;
  readonly rsvp?: Rsvp | keyof typeof Rsvp | null;
  readonly invited?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGamePlayer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GamePlayer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly player_id: string;
  readonly game_id: string;
  readonly rsvp?: Rsvp | keyof typeof Rsvp | null;
  readonly invited?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type GamePlayer = LazyLoading extends LazyLoadingDisabled ? EagerGamePlayer : LazyGamePlayer

export declare const GamePlayer: (new (init: ModelInit<GamePlayer>) => GamePlayer) & {
  copyOf(source: GamePlayer, mutator: (draft: MutableModel<GamePlayer>) => MutableModel<GamePlayer> | void): GamePlayer;
}

type EagerLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly name?: string | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly name?: string | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Location = LazyLoading extends LazyLoadingDisabled ? EagerLocation : LazyLocation

export declare const Location: (new (init: ModelInit<Location>) => Location) & {
  copyOf(source: Location, mutator: (draft: MutableModel<Location>) => MutableModel<Location> | void): Location;
}

type EagerPlayer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Player, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly skill_level?: number | null;
  readonly email?: string | null;
  readonly phone_number: string;
  readonly instagram?: string | null;
  readonly twitter?: string | null;
  readonly bio?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPlayer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Player, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly skill_level?: number | null;
  readonly email?: string | null;
  readonly phone_number: string;
  readonly instagram?: string | null;
  readonly twitter?: string | null;
  readonly bio?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Player = LazyLoading extends LazyLoadingDisabled ? EagerPlayer : LazyPlayer

export declare const Player: (new (init: ModelInit<Player>) => Player) & {
  copyOf(source: Player, mutator: (draft: MutableModel<Player>) => MutableModel<Player> | void): Player;
}

type EagerGame = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Game, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly date: string;
  readonly time: string;
  readonly skill_level?: number | null;
  readonly organizer?: string | null;
  readonly min_size?: number | null;
  readonly invited_players?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGame = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Game, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly date: string;
  readonly time: string;
  readonly skill_level?: number | null;
  readonly organizer?: string | null;
  readonly min_size?: number | null;
  readonly invited_players?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Game = LazyLoading extends LazyLoadingDisabled ? EagerGame : LazyGame

export declare const Game: (new (init: ModelInit<Game>) => Game) & {
  copyOf(source: Game, mutator: (draft: MutableModel<Game>) => MutableModel<Game> | void): Game;
}