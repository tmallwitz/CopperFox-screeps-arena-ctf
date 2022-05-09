import { StructureTower } from "game/prototypes";
import { StateMachine } from "../../../common/fsm/state-machine";
import { Tower } from "../../../common/game/tower";
import { Telegram } from "../../../common/messaging/telegram";
import { scanForEnemies } from "./states/scan-for-enemies";

export class CtfTower extends Tower {
  public readonly fsm = new StateMachine<CtfTower>(this);

  public constructor(tower: StructureTower) {
    super(tower);
    this.fsm.SetCurrentState(scanForEnemies);
  }

  public HandleMessage(telegram: Telegram): boolean {
    return this.fsm.HandleMessage(telegram);
  }

  public Update() {
    this.fsm.Update();
  }
}
