import { RoomPosition } from "game/prototypes";
import { SquadBase } from "./squad-base";

export abstract class SquadPointBase extends SquadBase {
  public target: RoomPosition = { x: -1, y: -1 };
}
