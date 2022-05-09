import { StateMachine } from "../../../common/fsm/state-machine";
import { Telegram } from "../../../common/messaging/telegram";
import { Squad } from "../../squad/squad";

export class SquadAttack extends Squad {
  public readonly fsm = new StateMachine<SquadAttack>(this);

  public constructor(name: string) {
    super(name);
  }

  public HandleMessage(telegram: Telegram): boolean {
    return this.fsm.HandleMessage(telegram);
  }

  public Update(): void {
    this.fsm.Update();
  }
}
