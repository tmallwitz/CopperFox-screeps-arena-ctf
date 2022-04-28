import { ATTACK } from "game/constants";
import { RoomPosition } from "game/prototypes";
import { InformationCenter } from "../information-center";
import { Squad } from "./squad";

export class SquadManager {
  public SplitCreepsIntoSquads(info: InformationCenter): Squad[] {
    function NewDefSquad(name: string, task: string, pos: RoomPosition): Squad {
      const S = new Squad(name, task);
      S.target = pos;
      info.myCreeps
        .filter(c => c.squad === undefined && c.body.some(i => i.type === ATTACK))
        .slice(0, 1)
        .forEach(c => S.addCreep(c));
      return S;
    }

    const ret: Squad[] = [];
    const myFlagPos: RoomPosition = { x: -1, y: -1 };
    if (info.myFlag) {
      myFlagPos.x = info.myFlag.x;
      myFlagPos.y = info.myFlag.y;
    }
    ret.push(NewDefSquad("Blocker", "defend", info.points.myFlag));
    ret.push(NewDefSquad("Libero", "defend", info.points.Libero));

    const deltaSquad = new Squad("Alpha", "attack");
    deltaSquad.target = info.points.enemyFlag;
    info.myCreeps.filter(c => c.squad === undefined).forEach(c => deltaSquad.addCreep(c));
    ret.push(deltaSquad);
    ret.forEach(s => console.log(s.name));

    return ret;
  }
}
