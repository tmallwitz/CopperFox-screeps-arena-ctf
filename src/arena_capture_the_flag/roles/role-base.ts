import { searchPath } from "game/path-finder";
import { Creep, GameObject } from "game/prototypes";
import { getDirection } from "game/utils";
import { InformationCenter } from "../information-center";

export abstract class RoleBase {
  public role = "";
  public abstract run(creep: Creep, informationCenter: InformationCenter): void;

  public flee(creep: Creep, targets: GameObject[], range: number, informationCenter: InformationCenter) {
    const result = searchPath(
      creep,
      targets.map(i => ({ pos: i, range })),
      { flee: true }
    );
    if (result.path.length > 0) {
      const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
      creep.move(direction);
    }
  }
}
