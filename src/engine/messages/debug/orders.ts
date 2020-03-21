import { Player, Message } from '../../../model/player'
import { Coord } from '../../../common/types'

const debugOrderMessages = {
  orders: {
    move: (
      receiver: Player,
      clan: { name: string },
      { x: fromX, y: fromY }: Coord,
      { x: toX, y: toY }: Coord,
    ): Message => ({
      type: 'debug',
      receiver,
      title: `Moved ${clan.name} clan`,
      content: `Moved ${clan.name} clan ${fromX},${fromY} -> ${toX},${toY}`,
      time: new Date().toISOString(),
    }),
    settle: (receiver: Player): Message => ({
      type: 'debug',
      receiver,
      title: '-',
      content: '-',
      time: new Date().toISOString(),
    }),
    advancement: (receiver: Player): Message => ({
      type: 'debug',
      receiver,
      title: '-',
      content: '-',
      time: new Date().toISOString(),
    }),
    build: (receiver: Player): Message => ({
      type: 'debug',
      receiver,
      title: '-',
      content: '-',
      time: new Date().toISOString(),
    }),
    tithe: (receiver: Player): Message => ({
      type: 'debug',
      receiver,
      title: '-',
      content: '-',
      time: new Date().toISOString(),
    }),
    magic: (receiver: Player): Message => ({
      type: 'debug',
      receiver,
      title: '-',
      content: '-',
      time: new Date().toISOString(),
    }),
  },
}

export default debugOrderMessages
