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
import { TOWER_RANGE } from "game/constants";
import { getTicks } from "game/utils";
import { TextOnCreep, TextOverCreep } from "../common/utils/visual-utils";
import { InformationCenter } from "./information-center";
import { RoleHeal } from "./roles/role-heal";
import { RoleMelee } from "./roles/role-melee";
import { RoleRange } from "./roles/role-range";
import { Squad } from "./squad/squad";
import { SquadManager } from "./squad/squad-manager";
import { SquadAttack } from "./squadroles/squad-attack";
import { SquadDefend } from "./squadroles/squad-defend";

declare module "game/prototypes" {
  interface Creep {
    initialPos: RoomPosition;
    squad: Squad | undefined;
  }
}

// You can also import your files like this:
// import {roleAttacker} from './roles/attacker.mjs';f

let informationCenter: InformationCenter;
const melee = new RoleMelee();
const range = new RoleRange();
const heal = new RoleHeal();
const squadManager: SquadManager = new SquadManager();
const squadDefend = new SquadDefend();
const squadAttack = new SquadAttack();
let squads: Squad[] = [];

// This is the only exported function from the main module. It is called every tick.
export function loop(): void {
  if (!informationCenter) informationCenter = new InformationCenter();
  informationCenter.update();
  if (getTicks() === 1) {
    squads = squadManager.SplitCreepsIntoSquads(informationCenter);
  }

  informationCenter.myTowers.forEach(tower => {
    const target = tower.findClosestByRange(informationCenter.enemyCreeps);
    if (target && tower.getRangeTo({ x: target.x, y: target.y }) <= TOWER_RANGE) {
      tower.attack(target);
    }
  });

  squads.forEach(s => {
    if (s.task === "attack") squadAttack.run(s, informationCenter);
    else squadDefend.run(s, informationCenter);
  });
  informationCenter.myCreeps.forEach(creep => {
    if (creep.squad) {
      TextOverCreep(creep, creep.squad.name);
      TextOnCreep(creep, creep.squad.task);
    }
  });
}
