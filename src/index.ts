import { initGameForPlayer, newGame } from './engine'
import { init } from './ui'

const playerAmt = 4

const game = newGame(Array(playerAmt).fill('Bob'))

let chosenTribe = 0

const togglers = {} as Record<string, VoidFunction>

const renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
const { refreshData } = init(renderData, togglers)

togglers.toggleChosenTribe = () => {
  chosenTribe = (chosenTribe + 1) % game.map.tribes.length
  const renderData = initGameForPlayer(game.players[chosenTribe].tribe, game)
  refreshData(renderData)
}
