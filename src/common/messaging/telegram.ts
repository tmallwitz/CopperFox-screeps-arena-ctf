import { BaseGameEntity } from "../game/base-game-entity";
import { entityManager } from "../game/entity-manager";

export class Telegram {
  public Sender: BaseGameEntity;
  public Receiver: BaseGameEntity;
  public Msg: string;
  public DispatchInTicks: number;
  public ExtraInfoJson: string;

  public constructor(
    sender: BaseGameEntity | string,
    receiver: BaseGameEntity | string,
    msg: string,
    dispatchInTicks?: number,
    extraInfoJson?: string
  ) {
    this.Receiver = receiver instanceof BaseGameEntity ? receiver : entityManager.GetEntityByID(receiver);
    this.Sender = sender instanceof BaseGameEntity ? sender : entityManager.GetEntityByID(sender);
    this.Msg = msg;
    this.DispatchInTicks = dispatchInTicks ?? 0;
    this.ExtraInfoJson = extraInfoJson ?? "{}";
  }
}
