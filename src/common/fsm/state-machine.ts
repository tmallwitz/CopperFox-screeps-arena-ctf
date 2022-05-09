import { BaseGameEntity } from "../game/base-game-entity";
import { Telegram } from "../messaging/telegram";
import { State } from "./state";

export class StateMachine<T extends BaseGameEntity> {
  private readonly owner: T;
  private currentState: State<T> | undefined;
  private previousState: State<T> | undefined;
  private globalState: State<T> | undefined;

  public constructor(owner: T) {
    this.owner = owner;
    this.currentState = undefined;
    this.previousState = undefined;
    this.globalState = undefined;
  }

  public SetCurrentState(newState: State<T>) {
    if (this.currentState)
      this.log(`Switching State from ${this.currentState.constructor.name} to ${newState.constructor.name}`);
    else this.log(`Switching State to ${newState.constructor.name}`);
    this.currentState = newState;
  }

  public SetPreviousState(newState: State<T>) {
    this.previousState = newState;
  }

  public SetGlobalState(newState: State<T>) {
    this.globalState = newState;
  }

  public Update(): void {
    if (this.globalState) this.globalState.Execute(this.owner);
    if (this.currentState) this.currentState.Execute(this.owner);
  }

  public HandleMessage(telegram: Telegram): boolean {
    if (this.globalState && this.globalState.OnMessage(this.owner, telegram)) return true;
    if (this.currentState && this.currentState.OnMessage(this.owner, telegram)) return true;
    return false;
  }

  public ChangeState(newState: State<T>) {
    this.previousState = this.currentState;
    if (this.currentState) this.currentState.Exit(this.owner);
    this.currentState = newState;
    this.currentState.Enter(this.owner);
    if (this.currentState) this.currentState.ThisIsATest(this.owner);
  }

  public RevertToPreviousState(): void {
    if (this.previousState) this.ChangeState(this.previousState);
  }

  public IsInState(state: State<T>): boolean {
    return typeof state === typeof this.currentState;
  }

  public GetNameOfCurrentState(): string {
    if (this.currentState) return this.currentState.constructor.name;
    return "undefined";
  }

  protected log(s: string): void {
    console.log(
      `[${this.owner.id}] ${this.constructor.name.toString()}: State<${this.owner.constructor.name}> => ${s}`
    );
  }
}
