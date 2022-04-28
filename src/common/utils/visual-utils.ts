import { PathStep } from "game/path-finder";
import { Creep, RoomPosition } from "game/prototypes";
import { Visual } from "game/visual";

export function DrawPath(p: PathStep[]) {
  new Visual().poly(p);
}

export function TextAt(text: string, pos: RoomPosition) {
  new Visual().text(text, pos, {
    font: "0.5",
    opacity: 0.7,
    backgroundColor: "#808080",
    backgroundPadding: 0.03
  });
}

export function TextOverCreep(creep: Creep, text: string): void {
  TextAt(text, { x: creep.x, y: creep.y - 0.5 });
}

export function TextOnCreep(creep: Creep, text: string): void {
  TextAt(text, { x: creep.x, y: creep.y });
}

export function TextUnderCreep(creep: Creep, text: string): void {
  TextAt(text, { x: creep.x, y: creep.y + 0.5 });
}
