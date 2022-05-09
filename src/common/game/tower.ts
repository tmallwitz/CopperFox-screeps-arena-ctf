import { TOWER_RANGE } from "game/constants";
import { StructureTower } from "game/prototypes";
import { informationCenter } from "../../arena_capture_the_flag/information-center";
import { Telegram } from "../messaging/telegram";
import { CartesianGameEntity } from "./cartesian-game-entity";

export class Tower extends CartesianGameEntity {
  public readonly tower: StructureTower;

  public constructor(tower: StructureTower) {
    super("Tower_" + tower.id);
    this.tower = tower;
  }

  public get x(): number {
    return this.tower.x;
  }

  public get y(): number {
    return this.tower.y;
  }

  public HandleMessage(telegram: Telegram): boolean {
    return false;
  }

  public Update(): void {
    const target = this.tower.findClosestByRange(informationCenter.enemyCreeps);
    if (target && this.tower.getRangeTo({ x: target.x, y: target.y }) <= TOWER_RANGE) {
      this.tower.attack(target);
    }
  }
}
