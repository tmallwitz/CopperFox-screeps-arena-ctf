import { Creep } from "game/prototypes";
import { getRange, getTicks } from "game/utils";
import { InformationCenter } from "../information-center";
import { RoleBase } from "./role-base";

export class RoleHeal extends RoleBase {
  public run(creep: Creep, informationCenter: InformationCenter): void {
    const targets = informationCenter.myCreeps
      .filter(i => i !== creep && i.hits < i.hitsMax)
      .sort((a, b) => a.hits - b.hits);

    if (targets.length) {
      creep.moveTo(targets[0]);
    } else {
      if (informationCenter.enemyFlag) {
        if (getTicks() > 1000) {
          creep.moveTo(informationCenter.enemyFlag);
        } else {
          creep.moveTo(creep.initialPos);
        }
      }
    }

    const healTargets = informationCenter.myCreeps
      .filter(i => i.hits < i.hitsMax && getRange(i, creep) <= 3)
      .sort((a, b) => a.hits - b.hits);

    if (healTargets.length > 0) {
      if (getRange(healTargets[0], creep) === 1) {
        creep.heal(healTargets[0]);
      } else {
        creep.rangedHeal(healTargets[0]);
      }
    }

    const range = 7;
    const enemiesInRange = informationCenter.enemyCreeps.filter(i => getRange(i, creep) < range);
    if (enemiesInRange.length > 0) {
      this.flee(creep, enemiesInRange, range, informationCenter);
    }

    if (informationCenter.enemyFlag) {
      if (getTicks() > 1000) {
        creep.moveTo(informationCenter.enemyFlag);
      }
    }
  }
}
