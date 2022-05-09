import { Telegram } from "../messaging/telegram";
import { entityManager } from "./entity-manager";

export abstract class BaseGameEntity {
  public readonly id: string;

  protected constructor(id: string) {
    this.id = id;
    entityManager.RegisterEntity(this);
  }

  public dispose(): void {
    entityManager.DeregisterEntity(this);
  }

  public abstract Update(): void;

  public abstract HandleMessage(telegram: Telegram): boolean;

  protected log(s: string): void {
    console.log(`[${this.id}]: ${this.constructor.name.toString()} => ${s}`);
  }
}
