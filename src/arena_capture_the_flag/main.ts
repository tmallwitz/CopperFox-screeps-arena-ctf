// Note that there is no global objects like Game or Memory. All methods, prototypes and constants are imported built-in modules
// import {
//   ATTACK,
//   CostMatrix,
//   HEAL,
//   RANGED_ATTACK,
//   RoomPosition,
//   getDirection,
//   getRange,
//   getObjectById,
//   getObjectsByPrototype,
//   getTime
// } from "game";

// Everything can be imported either from the root /game module or corresponding submodules
// import { pathFinder } from "game";
// pathFinder.searchPath();
// import { prototypes } from "game";
// prototypes.Creep
// prototypes.RoomObject

// import {searchPath } from '/game/path-finder';
// import {Creep} from '/game/prototypes';

// This would work too:
// import * as PathFinder from '/game/path-finder'; --> PathFinder.searchPath
// import {Creep} from '/game/prototypes/creep';
// import * as prototypes from '/game/prototypes'; --> prototypes.Creep

// This stuff is arena-specific
import { getTicks } from "game/utils";
import { entityManager } from "../common/game/entity-manager";
import { Tower } from "../common/game/tower";
import { messageDispatcher } from "../common/messaging/message-dispatcher";
import { TextOnCreep, TextOverCreep } from "../common/utils/visual-utils";
import { CtfTower } from "./game/tower/ctf-tower";
import { informationCenter } from "./information-center";
import { Squad } from "./squad/squad";
import { squadManager } from "./squad/squad-manager";

declare module "game/prototypes" {
  interface Creep {
    initialPos: RoomPosition;
    squad: Squad | undefined;
  }
}

let squads: Squad[] = [];

const towers: Tower[] = [];

// This is the only exported function from the main module. It is called every tick.
export function loop(): void {
  if (getTicks() === 1) {
    informationCenter.init();
    squads = squadManager.SplitCreepsIntoSquads();
    informationCenter.myTowers.forEach(tower => towers.push(new CtfTower(tower)));
  } else {
    informationCenter.update();
  }

  messageDispatcher.DispatchDelayedMsg();

  entityManager.RunUpdateOnEntities();

  // squads.forEach(s => {
  //   if (s.task === "attack") squadAttack.run(s);
  //   else squadDefend.run(s);
  // });

  informationCenter.myCreeps.forEach(creep => {
    if (creep.squad) {
      TextOverCreep(creep, creep.squad.name);
      TextOnCreep(creep, creep.squad.task);
    }
  });
}
