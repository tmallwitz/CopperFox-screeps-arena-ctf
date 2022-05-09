import { RoomPosition } from "game/prototypes";
import { StateMachine } from "../../../common/fsm/state-machine";
import { Telegram } from "../../../common/messaging/telegram";
import { Squad } from "../../squad/squad";
import { moveToPos } from "./states/move-to-pos";

export class SquadDefend extends Squad {
  public readonly fsm = new StateMachine<SquadDefend>(this);
  public target: RoomPosition;

  public constructor(name: string, target: RoomPosition) {
    super(name);
    this.target = target;
    this.fsm.SetCurrentState(moveToPos);
    this.log(JSON.stringify(this.target));
  }

  public HandleMessage(telegram: Telegram): boolean {
    return this.fsm.HandleMessage(telegram);
  }

  public Update(): void {
    this.fsm.Update();
  }
}
