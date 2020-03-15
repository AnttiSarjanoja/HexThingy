import { getMap } from '../helpers/map'
import { Game } from '../model/game'
import { getRenderData } from './fov'
import { Tribe } from '../model/map'

// TODO: Insert other data?
export const newGame = (users: string[]): Game => {
  const map = getMap(users.length) // TODO: should maybe return map AND players

  return {
    map,
    players: users.map((u, i) => ({ name: u, tribe: map.tribes[i] })),
    turns: [],
  }
}

export const initGameForPlayer = (tribe: Tribe, game: Game) =>
  getRenderData(tribe, game.map)
