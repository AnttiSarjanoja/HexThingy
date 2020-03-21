# Orders

## Move

General move order for moving clans and warriors on the map.

### Payload:

- Target - Hex (not sea)
- Warriors? - Any tribe warriors
- Clan? - Any single tribe clan

### Precondition:

- IF leader on map THEN leader must be in move range of hex
- IF leader not on map THEN some friendly clan must be in move range

### Effects:

1. All warriors (if any) currently led by the leader will move to target
2. Any other warriors or a single clan may move if in range from friendly territory
3. All moved warriors will form an army led by the issuing leader

## Settle

Order for generating clans for the tribe

### Payload:

- Target - Hex

### Precondition:

- Hex must be habitable (Tribe advancements may help)
- Hex must be in a friendly region that is clan-, enemy warrior-, and beast free
- Region must enough food for a new clan

### Effects:

1. A single new clan of the tribe will appear in the hex

## Advancement

Order for advancing the Tribe

### Payload:

- Type - Idea | Culture | ???
- Name - Name of advancement e.g. Slavery

### Precondition:

- Tribe must be ready for an advancement
- Preconditions of chosen advancement must be met

### Effects:

1. Tribe will get a permanent advancement buff

## Build

Order for producing (semi)permanent features on a map hex

### Payload:

- Target - Hex
- Type - Building name

### Precondition:

- Hex must be in friendly region with a clan
- Hex must not contain a building (ready or uncomplete)
- Hex / Tribe / Region must meet building requirements

### Effects:

1. Automatic construction of the building type is started

## Tithe

Collecting exploited strategic and riches -resources

### Payload:

- (Type)
- (Etc)

### Precondition:

- (Precondition)

### Effects:

1. (Effect)

---

## (topic)

(Description)

### Payload:

- (Target)
- (Type)
- (Etc)

### Precondition:

- (Precondition)

### Effects:

1. (Effect)
