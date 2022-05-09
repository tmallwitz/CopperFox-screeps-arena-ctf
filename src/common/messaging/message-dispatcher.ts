import { BaseGameEntity } from "../game/base-game-entity";
import { entityManager } from "../game/entity-manager";
import { Telegram } from "./telegram";

interface PriorityQData {
  sender: string;
  receiver: string;
  msg: string;
  dispatchInTicks: number;
  extraInfoJson: string;
}

class MessageDispatcher {
  private PriorityQ: Telegram[] = [];

  public Serialize(): string {
    const lst: PriorityQData[] = [];
    this.PriorityQ.forEach(t =>
      lst.push({
        sender: t.Sender.id,
        receiver: t.Receiver.id,
        msg: t.Msg,
        dispatchInTicks: t.DispatchInTicks,
        extraInfoJson: t.ExtraInfoJson
      })
    );
    return JSON.stringify(lst);
  }

  public Deserialize(data: string): void {
    const lst: PriorityQData[] = JSON.parse(data) as PriorityQData[];
    lst.forEach(l => this.DispatchMsg(l.sender, l.receiver, l.msg, l.dispatchInTicks, l.extraInfoJson));
  }

  public HasQueueEntries(): boolean {
    return this.PriorityQ.length > 0;
  }

  public DispatchMsg(
    sender: BaseGameEntity | string,
    receiver: BaseGameEntity | string,
    msg: string,
    dispatchInTicks?: number,
    extraInfoJson?: string
  ) {
    const Receiver = receiver instanceof BaseGameEntity ? receiver : entityManager.GetEntityByID(receiver);
    const Sender = sender instanceof BaseGameEntity ? sender : entityManager.GetEntityByID(sender);
    const Msg = msg;
    const DispatchInTicks = dispatchInTicks ?? 0;
    const ExtraInfoJson = extraInfoJson ?? "{}";
    const telegram = new Telegram(Receiver, Sender, Msg, DispatchInTicks, ExtraInfoJson);
    if (DispatchInTicks <= 0) {
      this.Discharge(Receiver, telegram);
    } else {
      this.PriorityQ.push(telegram);
    }
  }

  public DispatchDelayedMsg(): void {
    if (this.PriorityQ.length === 0) return;
    const CompareTelegram = function (a: Telegram, b: Telegram) {
      if (a.DispatchInTicks < b.DispatchInTicks) return -1;
      if (a.DispatchInTicks > b.DispatchInTicks) return 1;
      return 0;
    };
    this.PriorityQ.sort(CompareTelegram);
    this.PriorityQ.forEach(t => t.DispatchInTicks--);
    while (this.PriorityQ.length > 0 && this.PriorityQ[0].DispatchInTicks <= 0) {
      const telegram = this.PriorityQ.pop();
      if (telegram) this.Discharge(telegram.Receiver, telegram);
    }
  }

  private CompareTelegram(a: Telegram, b: Telegram) {
    if (a.DispatchInTicks < b.DispatchInTicks) return -1;
    if (a.DispatchInTicks > b.DispatchInTicks) return 1;
    return 0;
  }

  private Discharge(receiver: BaseGameEntity, message: Telegram): void {
    if (!receiver.HandleMessage(message)) console.log("MSG not handled");
  }
}

export const messageDispatcher = new MessageDispatcher();
