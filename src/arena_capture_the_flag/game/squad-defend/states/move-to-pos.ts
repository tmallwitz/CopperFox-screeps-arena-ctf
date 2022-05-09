import { State } from "../../../../common/fsm/state";
import { SquadDefend } from "../squad-defend";
import { defendPos } from "./defend-pos";

class MoveToPos extends State<SquadDefend> {
  public Execute(entity: SquadDefend): void {
    if (entity.creeps.filter(c => c.x === entity.target.x && c.y === entity.target.y).length > 0) {
      entity.fsm.ChangeState(defendPos);
    } else {
      entity.moveTo(entity.target);
    }
  }

  public Exit(entity: SquadDefend): void {
    this.log(entity, "Reached pos: " + JSON.stringify(entity.target));
  }

  public Enter(entity: SquadDefend): void {
    this.log(entity, "Moving now to pos: " + JSON.stringify(entity.target));
  }
}

export const moveToPos = new MoveToPos();
