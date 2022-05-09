import { ATTACK } from "game/constants";
import { getRange } from "game/utils";
import { State } from "../../../../common/fsm/state";
import { informationCenter } from "../../../information-center";
import { SquadHoldPos } from "../squad-hold-pos";

class HoldPos extends State<SquadHoldPos> {
  public Execute(entity: SquadHoldPos): void {
    // entity.moveTo(entity.target);
    // Melee
    entity.creeps
      .filter(c => c.body.some(i => i.type === ATTACK))
      .forEach(creep => {
        const targets = informationCenter.enemyCreeps
          .filter(i => getRange(i, creep) === 1)
          .sort((a, b) => getRange(a, creep) - getRange(b, creep));
        if (targets.length > 0) {
          creep.attack(targets[0]);
        }
      });
  }
}

export const holdPos = new HoldPos();
