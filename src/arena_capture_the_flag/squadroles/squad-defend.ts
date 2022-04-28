import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { getRange } from "game/utils";
import { InformationCenter } from "../information-center";
import { Squad } from "../squad/squad";
import { SquadPointBase } from "./squad-point-base";

export class SquadDefend extends SquadPointBase {
  public run(squad: Squad, informationCenter: InformationCenter): void {
    squad.moveTo(squad.target);
    if (squad.target) {
      squad.moveTo(squad.target);
      console.log(`Squad ${squad.name} runs role Defender for pos ${squad.target.x}/${squad.target.y}`);
    } else {
      console.log(`Squad ${squad.name} runs role Defender but has no pos`);
    }
    // Melee
    squad.creeps
      .filter(c => c.body.some(i => i.type === ATTACK))
      .forEach(creep => {
        const targets = informationCenter.enemyCreeps
          .filter(i => getRange(i, creep) < 10)
          .sort((a, b) => getRange(a, creep) - getRange(b, creep));
        if (targets.length > 0) {
          creep.moveTo(targets[0]);
          creep.attack(targets[0]);
        }
      });
    // Range
    squad.creeps
      .filter(c => c.body.some(i => i.type === RANGED_ATTACK))
      .forEach(creep => {
        const targets = informationCenter.enemyCreeps.sort((a, b) => getRange(a, creep) - getRange(b, creep));
        if (targets.length > 0) {
          creep.rangedAttack(targets[0]);
        }
      });
    // Heal
    squad.creeps
      .filter(c => c.body.some(i => i.type === HEAL))
      .forEach(creep => {
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
      });
  }
}
