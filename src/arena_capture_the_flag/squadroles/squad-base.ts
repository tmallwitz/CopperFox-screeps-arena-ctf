import { searchPath } from "game/path-finder";
import { GameObject } from "game/prototypes";
import { getDirection } from "game/utils";
import { InformationCenter } from "../information-center";
import { Squad } from "../squad/squad";

export abstract class SquadBase {
  public role = "";

  public abstract run(squad: Squad, informationCenter: InformationCenter): void;

  public flee(squad: Squad, targets: GameObject[], range: number, informationCenter: InformationCenter) {
    const creep = squad.firstCreep();
    const result = searchPath(
      creep,
      targets.map(i => ({ pos: i, range })),
      { flee: true }
    );
    if (result.path.length > 0) {
      const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
      squad.move(direction);
    }
  }
}
