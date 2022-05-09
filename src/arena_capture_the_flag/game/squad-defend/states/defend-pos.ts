import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { getRange } from "game/utils";
import { State } from "../../../../common/fsm/state";
import { informationCenter } from "../../../information-center";
import { SquadDefend } from "../squad-defend";

class DefendPos extends State<SquadDefend> {
  public Execute(entity: SquadDefend): void {
    entity.moveTo(entity.target);
    // Melee
    entity.creeps
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
    entity.creeps
      .filter(c => c.body.some(i => i.type === RANGED_ATTACK))
      .forEach(creep => {
        const targets = informationCenter.enemyCreeps.sort((a, b) => getRange(a, creep) - getRange(b, creep));
        if (targets.length > 0) {
          creep.rangedAttack(targets[0]);
        }
      });
    // Heal
    entity.creeps
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

  public Enter(entity: SquadDefend): void {
    this.log(entity, "Defending pos: " + JSON.stringify(entity.target));
  }

  public Exit(entity: SquadDefend): void {
    this.log(entity, "Stop defending pos: " + JSON.stringify(entity.target));
  }
}

export const defendPos = new DefendPos();
