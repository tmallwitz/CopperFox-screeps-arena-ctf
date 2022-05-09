import { State } from "../../../../common/fsm/state";
import { SquadHoldPos } from "../squad-hold-pos";
import { holdPos } from "./hold-pos";

class MoveToPos extends State<SquadHoldPos> {
  public Execute(entity: SquadHoldPos): void {
    if (entity.firstCreep().x === entity.target.x && entity.firstCreep().y === entity.target.y) {
      entity.fsm.ChangeState(holdPos);
    } else {
      entity.moveTo(entity.target);
    }
  }

  public Enter(entity: SquadHoldPos): void {
    this.log(entity, "Moving now to pos: " + JSON.stringify(entity.target));
  }

  public Exit(entity: SquadHoldPos): void {
    this.log(entity, "Reached pos: " + JSON.stringify(entity.target));
  }
}

export const moveToPos = new MoveToPos();
