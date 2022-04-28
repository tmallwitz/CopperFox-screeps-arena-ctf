import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { findClosestByRange, getRange } from "game/utils";
import { TextOnCreep, TextOverCreep, TextUnderCreep } from "../../common/utils/visual-utils";
import { InformationCenter } from "../information-center";
import { Squad } from "../squad/squad";
import { SquadPointBase } from "./squad-point-base";

export class SquadAttack extends SquadPointBase {
  public run(squad: Squad, informationCenter: InformationCenter): void {
    if (squad.target) {
      squad.moveTo(squad.target);
      console.log(`Squad ${squad.name} runs role Attacker for pos ${squad.target.x}/${squad.target.y}`);
    } else {
      console.log(`Squad ${squad.name} runs role Attacker but has no pos`);
    }

    let enemiesAround = squad.enemiesAround(informationCenter);
    const OwnNeedHeal = squad.creeps.filter(c => c.hits < c.hitsMax).sort((a, b) => a.hits - b.hits);
    console.log(`  enemiesAround: ${enemiesAround.length} | OwnNeedHeal: ${OwnNeedHeal.length} `);
    // No enemies? Move to target
    if (enemiesAround.length === 0) {
      console.log(`  moveTo Target`);
      squad.moveTo(squad.target);
      return;
    }

    // Only one?
    if (enemiesAround.length === 1) {
      console.log(`  Attack Single Enemy`);
      squad.attack(enemiesAround[0].creep);
      return;
    }

    // lets calc the danger level
    const factorDMG = 10;
    const factorHeal = 100;
    const factorElse = 1;

    enemiesAround.forEach(
      ea =>
        (ea.dangerLevel =
          factorDMG * ea.creep.body.filter(b => b.hits > 0 && (b.type === ATTACK || b.type === RANGED_ATTACK)).length)
    );
    enemiesAround.forEach(
      ea => (ea.dangerLevel = factorHeal * ea.creep.body.filter(b => b.hits > 0 && b.type === HEAL).length)
    );

    enemiesAround.forEach(
      ea =>
        (ea.dangerLevel =
          factorElse *
          ea.creep.body.filter(b => b.hits > 0 && b.type !== ATTACK && b.type !== RANGED_ATTACK && b.type !== HEAL)
            .length)
    );

    enemiesAround.forEach(c => {
      TextOverCreep(c.creep, "DL " + c.dangerLevel.toString());
      TextOnCreep(c.creep, "IR " + c.creepsInRange.toString());
      TextUnderCreep(c.creep, "D " + c.distance.toString());
    });

    // who can attack who
    squad.creeps
      .filter(c => c.body.some(i => i.type === ATTACK))
      .forEach(oc =>
        enemiesAround
          .filter(c => c.dangerLevel > 0)
          .forEach(ec => {
            if (getRange(oc, ec.creep) === 1) {
              ec.creepsInRange++;
            }
          })
      );
    squad.creeps
      .filter(c => c.body.some(i => i.type === RANGED_ATTACK))
      .forEach(oc =>
        enemiesAround
          .filter(c => c.dangerLevel > 0)
          .forEach(ec => {
            if (getRange(oc, ec.creep) <= 3) {
              ec.creepsInRange++;
            }
          })
      );
    // resort
    enemiesAround = enemiesAround.sort((a, b) => b.creepsInRange - a.creepsInRange);

    // attack
    for (const oc of squad.creeps.filter(c => c.body.some(i => i.type === ATTACK || i.type === RANGED_ATTACK))) {
      let range = 0;
      if (oc.body.some(i => i.type === ATTACK)) range = 1;
      if (oc.body.some(i => i.type === RANGED_ATTACK)) range = 3;
      const inRange = enemiesAround
        .filter(ec => ec.dangerLevel > 0 && getRange(oc, ec.creep) <= range)
        .sort((a, b) => b.creepsInRange - a.creepsInRange);
      if (inRange.length > 0) {
        if (oc.body.some(i => i.type === ATTACK)) oc.attack(inRange[0].creep);
        if (oc.body.some(i => i.type === RANGED_ATTACK)) oc.rangedAttack(inRange[0].creep);
      } else {
        oc.moveTo(enemiesAround[0].creep);
      }
    }

    if (OwnNeedHeal.length > 0) {
      for (const oc of squad.creeps.filter(c => c.body.some(i => i.type === HEAL))) {
        const inRange = OwnNeedHeal.filter(c => getRange(oc, c) <= 3).sort((a, b) => a.hits - b.hits);
        if (inRange.length > 0) {
          if (getRange(oc, inRange[0]) === 1) {
            oc.heal(inRange[0]);
          } else {
            oc.rangedHeal(inRange[0]);
          }
        }
      }
    } else {
      // if no one needs healing move to the front line where heal might be needed soon
      for (const oc of squad.creeps.filter(c => c.body.some(i => i.type === HEAL))) {
        const nearEnemy = enemiesAround.sort((a, b) => a.distance - b.distance).slice(0, 1);
        const ownCreepNearEnemy = findClosestByRange(nearEnemy[0].creep, squad.creeps);
        oc.moveTo(ownCreepNearEnemy);
      }
    }
  }
}
