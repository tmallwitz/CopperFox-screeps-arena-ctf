import { ATTACK } from "game/constants";
import { RoomPosition } from "game/prototypes";
import { SquadDefend } from "../game/squad-defend/squad-defend";
import { SquadHoldPos } from "../game/squad-hold-pos/squad-hold-pos";
import { informationCenter } from "../information-center";
import { Squad } from "./squad";

class SquadManager {
  public SplitCreepsIntoSquads(): Squad[] {
    const info = informationCenter;

    const ret: Squad[] = [];
    const myFlagPos: RoomPosition = { x: -1, y: -1 };
    if (info.myFlag) {
      myFlagPos.x = info.myFlag.x;
      myFlagPos.y = info.myFlag.y;
    }

    let S = new SquadHoldPos("Blocker", info.points.myFlag);
    info.myCreeps
      .filter(c => c.squad === undefined && c.body.some(i => i.type === ATTACK))
      .slice(0, 1)
      .forEach(c => S.addCreep(c));
    ret.push(S);

    S = new SquadDefend("Libero", info.points.Libero);
    info.myCreeps
      .filter(c => c.squad === undefined && c.body.some(i => i.type === ATTACK))
      .slice(0, 1)
      .forEach(c => S.addCreep(c));
    ret.push(S);

    S = new SquadDefend("Alpha", info.points.AlphaDef);
    info.myCreeps.filter(c => c.squad === undefined).forEach(c => S.addCreep(c));
    ret.push(S);

    return ret;
  }
}

export const squadManager = new SquadManager();
