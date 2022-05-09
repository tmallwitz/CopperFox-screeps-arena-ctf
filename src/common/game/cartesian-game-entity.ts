import { RoomPosition } from "game/prototypes";
import { BaseGameEntity } from "./base-game-entity";

export abstract class CartesianGameEntity extends BaseGameEntity implements RoomPosition {
  public abstract get x(): number;

  public abstract get y(): number;
}
