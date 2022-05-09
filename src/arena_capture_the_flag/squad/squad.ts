import { ATTACK, DirectionConstant, RANGED_ATTACK } from "game/constants";
import { Creep, RoomPosition, StructureTower } from "game/prototypes";
import { findPath, getRange } from "game/utils";
import { BaseGameEntity } from "../../common/game/base-game-entity";
import { Telegram } from "../../common/messaging/telegram";
import { DrawPath, TextUnderCreep } from "../../common/utils/visual-utils";
import { informationCenter } from "../information-center";

export interface creepAround {
  creep: Creep;
  distance: number;
  dangerLevel: number;
  creepsInRange: number;
}

export abstract class Squad extends BaseGameEntity {
  public name: string;
  public task = "defend";
  public target: RoomPosition = { x: -1, y: -1 };
  public creeps: Creep[] = [];

  protected constructor(name: string, task?: string) {
    super("Squad_" + name);
    this.name = name;
    if (task) {
      this.task = task;
    }
  }

  public abstract HandleMessage(telegram: Telegram): boolean;

  public abstract Update(): void;

  public firstCreep(): Creep {
    return this.creeps.filter(c => c.hits > 0)[0];
  }

  public addCreep(creep: Creep) {
    this.creeps.push(creep);
    creep.squad = this;
  }

  public moveTo(r: RoomPosition) {
    const path = findPath(this.firstCreep(), r);
    DrawPath(path);
    const index = Math.min(3, path.length - 1);
    this.creeps.forEach(c => c.moveTo(path[index]));
  }

  public move(d: DirectionConstant) {
    this.creeps.forEach(c => c.move(d));
  }

  public attack(target: Creep | StructureTower) {
    this.creeps.forEach(c => {
      if (c.body.some(i => i.type === RANGED_ATTACK)) c.rangedAttack(target);
      if (c.body.some(i => i.type === ATTACK)) c.attack(target);
    });
  }

  public enemiesAround(): creepAround[] {
    const info = informationCenter;
    const RangeAttackDistance = 3;
    // find Scan Area
    const xArr = this.creeps.map(c => c.x);
    const yArr = this.creeps.map(c => c.y);
    const minX = Math.max(1, Math.min(...xArr) - 2 * RangeAttackDistance);
    const maxX = Math.min(98, Math.max(...xArr) + 2 * RangeAttackDistance);
    const minY = Math.max(1, Math.min(...yArr) - 2 * RangeAttackDistance);
    const maxY = Math.min(98, Math.max(...yArr) + 2 * RangeAttackDistance);
    // find enemies
    const enemies: creepAround[] = [];
    info.enemyCreeps
      .filter(c => c.x > minX && c.x <= maxX && c.y >= minY && c.y <= maxY)
      .forEach(c => enemies.push({ creep: c, distance: -1, dangerLevel: -1, creepsInRange: 0 }));
    // distance calc
    enemies.forEach(ec => (ec.distance = Math.min(...this.creeps.map(oc => getRange(oc, ec.creep)))));
    enemies.forEach(c => TextUnderCreep(c.creep, "D " + c.distance.toString()));
    return enemies;
  }
}
