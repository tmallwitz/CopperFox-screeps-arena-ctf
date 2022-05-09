import { TOWER_RANGE } from "game/constants";
import { State } from "../../../../common/fsm/state";
import { informationCenter } from "../../../information-center";
import { CtfTower } from "../ctf-tower";

class ScanForEnemies extends State<CtfTower> {
  public Execute(entity: CtfTower): void {
    const target = entity.tower.findClosestByRange(informationCenter.enemyCreeps);
    if (target && entity.tower.getRangeTo({ x: target.x, y: target.y }) <= TOWER_RANGE) {
      entity.tower.attack(target);
    }
  }
}

export const scanForEnemies = new ScanForEnemies();
