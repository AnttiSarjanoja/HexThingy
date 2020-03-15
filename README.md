# HexThingy (working title)

Maybe a game someday.

## TL;DR

- `npm install`
- `npm start`
- open browser to http://localhost:3000

## TODO

- Data away from bundle
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
- PIXI.js hex rendering (replace Display)
- ESLint + Husky
- Unit testing
- Commitlint
- React for better UI

## Notes

- Backend must validate all orders through Validator
- UI must prohibit user from doing invalid rules
  - double check generated orders with Validator to prevent unsynchronized order generation and validation
