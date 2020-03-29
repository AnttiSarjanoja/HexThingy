# HexThingy (working title)

Maybe a game someday.

## TL;DR

- `npm install`
- `npm start`
- open browser to http://localhost:3000

## TODO

- Make everything as functional as possible (at least non-mutating)
- Split code to client-shared-server
- Monorepo with packages (lerna maybe only option?)
- Data (jsons) away from bundle
  - Dynamic importing
- Tribe model
  - Seen hexes (turn, contents)
  - Advancements
- Game motor
  - Leaders to orders
  - Combat
  - Gods
  - Beheima
  - Buildings
- Saving game to localstorage
  - Replace cyclical deps to ids
  - Either store one big tree with partial serialization or make it fully serialized with a master list
- Fine tune world creation
  - Creation context for avoiding duplicate Beast / Clan / Region names
- PIXI.js hex rendering (replace Display)
  - Really nice to have - PIXI.projection, 2D map trapezoid tilting OR 3D camera
- Unit testing

## Notes

- Backend must validate all orders through Validator
- UI must prohibit user from doing invalid rules
  - double check generated orders with Validator to prevent unsynchronized order generation and validation
