import { Creep } from "game/prototypes";
import { getRange } from "game/utils";
import { Visual } from "game/visual";
import { InformationCenter } from "../information-center";
import { RoleBase } from "./role-base";

export class RoleMelee extends RoleBase {
  public run(creep: Creep, informationCenter: InformationCenter): void {
    // Here is the alternative to the creep "memory" from Screeps World. All game objects are persistent. You can assign any property to it once, and it will be available during the entire match.
    if (!creep.initialPos) {
      creep.initialPos = { x: creep.x, y: creep.y };
    }
    const targets = informationCenter.enemyCreeps
      .filter(i => getRange(i, creep.initialPos) < 10)
      .sort((a, b) => getRange(a, creep) - getRange(b, creep));

    if (targets.length > 0) {
      creep.moveTo(targets[0]);
      creep.attack(targets[0]);
    } else {
      //creep.moveTo(creep.initialPos);
      if (informationCenter.enemyFlag) {
        creep.moveTo(informationCenter.enemyFlag);
      }
    }
  }
}
