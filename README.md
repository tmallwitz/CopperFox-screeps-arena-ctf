# Screeps Arena Bot(s)
based on [Screeps Arena Typescript Starter](https://github.com/screepers/screeps-arena-typescript-starter)

## This bot is a WIP

## [Screeps Arena](https://store.steampowered.com/app/1137320/Screeps_Arena/) is a new game _under active development_,

### Any issues you experience with this repo should be created as an issue in this repo, _the Screeps Arena devs should NOT be contacted!_

---

## Supported Arenas
  - [x] Capture the Flag (WIP)
  - [ ] Spawn and Swamp
  - [ ] Collect and Control
  - [ ] Capture the Flag - Advanced Level
  - [ ] Spawn and Swamp - Advanced Level
  - [ ] Collect and Control - Advanced Level

---

## Basic Usage

You will need:

- [Node.JS](https://nodejs.org/en/download) (10.x || 12.x || 16.x)
- A Package Manager ([Yarn](https://yarnpkg.com/en/docs/getting-started) or [npm](https://docs.npmjs.com/getting-started/installing-node))
- Rollup CLI (Optional, install via `npm install -g rollup`)

Open the folder in your terminal and run your package manager to install the required packages and TypeScript declaration files:

```bash
# npm
npm install

# yarn
yarn
```

Fire up your preferred editor with typescript installed and you are good to go!

- arenas are located in `src/arena_*`any folder you create in `src` with a name starting with `arena_` will result in a `main.mjs` in the `dist/arena_*` folder.
- Run `npm run build` to generate all arenas to `/dist/*`

- `npm run build` - everything is build, the player can change their arena to look at the specific `/dist/arena*` directory
  - this template produces the following as an example `/dist/alpha_capture_the_flag/main.mjs`
- `npm run build capture` - a specific arena is build, the player can change their arena to look at the specific `/dist/arena*` directory knowing only that arena was updated

- Copy the `main.mjs` file to your desired location or change the location in the Screeps Arena client to point to the desired `/dist/*` folder.


## Typings

It uses the following project for typings https://github.com/screepers/typed-screeps-arena
When the typings are updated and you need to get the newest types

- delete node_modules/@types/screeps-arena
- run `npm i` to reinstall the packages. You might need to delete package-lock.json to get the types.

