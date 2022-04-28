import { Creep } from "game/prototypes";
import { getRange, getTicks } from "game/utils";
import { InformationCenter } from "../information-center";
import { RoleBase } from "./role-base";

export class RoleRange extends RoleBase {
  public run(creep: Creep, informationCenter: InformationCenter): void {
    const targets = informationCenter.enemyCreeps.sort((a, b) => getRange(a, creep) - getRange(b, creep));

    if (targets.length > 0) {
      creep.rangedAttack(targets[0]);
    }

    if (informationCenter.enemyFlag) {
      if (getTicks() > 1000) {
        creep.moveTo(informationCenter.enemyFlag);
      } else {
        creep.moveTo(creep.initialPos);
      }
    }

    const range = 3;
    const enemiesInRange = informationCenter.enemyCreeps.filter(i => getRange(i, creep) < range);
    if (enemiesInRange.length > 0) {
      this.flee(creep, enemiesInRange, range, informationCenter);
    }
  }
}
