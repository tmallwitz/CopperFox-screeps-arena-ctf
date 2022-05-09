import { BaseGameEntity } from "./base-game-entity";

class EntityManager {
  private data: { [entity: string]: BaseGameEntity } = {};

  public RegisterEntity(e: BaseGameEntity) {
    // this.data. push({ e });
    this.data[e.id] = e;
  }

  public DeregisterEntity(e: BaseGameEntity) {
    delete this.data[e.id];
  }

  public GetEntityByID(id: string) {
    return this.data[id];
  }

  public RunUpdateOnEntities(): void {
    for (const key in this.data) {
      this.data[key].Update();
    }
  }
}

export const entityManager = new EntityManager();
