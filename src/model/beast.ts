export const beastTypes = [
  'Ziz-ann',
  'Behem-ann',
  'Neth-ann',
  'Nun-ann',
  'Baas-set',
]

type BeastType = typeof beastTypes[number]

export type Beast = {
  name: string
  type: BeastType
}
