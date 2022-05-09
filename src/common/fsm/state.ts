import { BaseGameEntity } from "../game/base-game-entity";
import { Telegram } from "../messaging/telegram";

export abstract class State<T extends BaseGameEntity> {
  public abstract Execute(entity: T): void;

  public Enter(entity: T): void {
    this.log(entity, "Enter");
  }

  public Exit(entity: T): void {
    this.log(entity, "Exit");
  }

  public OnMessage(entity: T, telegram: Telegram): boolean {
    return false;
  }

  protected log(entity: T, s: string): void {
    console.log(`[${entity.id}] ${this.constructor.name}: State<${entity.constructor.name}> => ${s}`);
  }
}
