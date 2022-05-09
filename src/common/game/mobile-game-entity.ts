import { RoomPosition } from "game/prototypes";
import { CartesianGameEntity } from "./cartesian-game-entity";

export abstract class MobileGameEntity extends CartesianGameEntity {
  public abstract move(pos: RoomPosition): boolean;
}
