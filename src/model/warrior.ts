type Buff = {
  type: string
  time?: number
}

export type Warrior = {
  name: string // of clan
  owner?: string // id
  leader?: string // id
  wounded?: boolean
  buffs: Buff[]
}
