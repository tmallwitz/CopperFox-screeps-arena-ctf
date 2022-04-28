import { Flag } from "arena";
import { CONNREFUSED } from "dns";
import { Creep, RoomPosition, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export class InformationCenter {
  public myCreeps: Creep[] = [];
  public myTowers: StructureTower[] = [];
  public enemyCreeps: Creep[] = [];
  public enemyFlag: Flag | undefined;
  public myFlag: Flag | undefined;

  public points: { [key: string]: RoomPosition } = {};

  public constructor() {
    this.enemyFlag = getObjectsByPrototype(Flag).find(i => !i.my);
    this.myFlag = getObjectsByPrototype(Flag).find(i => i.my);
    if (this.myFlag && this.myFlag.x < 50) this.points.Libero = { x: 7, y: 7 };
    else this.points.Libero = { x: 92, y: 92 };
    if (this.myFlag) this.points.myFlag = { x: this.myFlag.x, y: this.myFlag.y };
    if (this.enemyFlag) this.points.enemyFlag = { x: this.enemyFlag.x, y: this.enemyFlag.y };

    this.points.Alpha = { x: 66, y: 35 };
  }

  public update(): void {
    // We assign global variables here. They will be accessible throughout the tick, and even on the following ticks too.
    // getObjectsByPrototype function is the alternative to Room.find from Screeps World.
    // There is no Game.creeps or Game.structures, you can manage game objects in your own way.
    this.myCreeps = getObjectsByPrototype(Creep).filter(i => i.my);
    this.enemyCreeps = getObjectsByPrototype(Creep).filter(i => !i.my);
    this.myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);
  }
}
