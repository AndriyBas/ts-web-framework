import { Eventing } from "./Eventing";
import axios, { AxiosPromise, AxiosResponse } from "axios";

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();
  constructor(public rootUrl: string, public deserialize: (json: K) => T) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): AxiosPromise {
    return axios.get(this.rootUrl).then((response: AxiosResponse) => {
      this.models = response.data.map((value: K) => this.deserialize(value));
      this.trigger("change");
      return response.data;
    });
  }
}
