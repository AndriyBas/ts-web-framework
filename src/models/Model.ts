import { Callback, Eventing } from "./Eventing";
import { AxiosPromise, AxiosResponse } from "axios";

enum BaseEvents {
  Change = "change",
  Save = "save",
  Error = "error",
}

export interface ModelAttributes<T> {
  get<K extends keyof T>(key: K): T[K];
  set(value: T): void;
  getAll(): T;
}

export interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

export interface Events {
  on(eventName: string, callback: Callback): void;
  trigger(eventName: string): void;
}

export interface HasId {
  id?: number;
}

export class Model<T extends HasId>
  implements Events, Sync<T>, ModelAttributes<T>
{
  // private events: Events;
  // private sync: Sync<T>;
  // private attrs: ModelAttributes<T>;

  constructor(
    private attrs: ModelAttributes<T>,
    private sync: Sync<T>,
    private events: Events = new Eventing()
  ) {}

  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attrs.get;
  getAll = this.attrs.getAll;

  set = (update: T): void => {
    this.attrs.set(update);
    this.events.trigger(BaseEvents.Change);
  };

  // get get() {
  //   return this.attrs.get;
  // }

  // get on() {
  //   return this.events.on;
  // }

  // get trigger() {
  //   return this.events.trigger;
  // }

  fetch = (): AxiosPromise => {
    const id = this.get("id");
    if (id) {
      return this.sync.fetch(id).then((response: AxiosResponse) => {
        this.set(response.data);
        this.trigger(BaseEvents.Change);
        return response;
      });
    } else {
      throw new Error("Cannot fetch without an ID");
    }
  };

  save = (): AxiosPromise => {
    return this.sync
      .save(this.attrs.getAll())
      .then((response: AxiosResponse) => {
        this.set(response.data);
        this.trigger(BaseEvents.Save);
        return response.data;
      });
  };
}
