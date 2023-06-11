import { HasId, Model } from "../models/Model";

export abstract class View<T extends Model<K>, K extends HasId> {
  abstract template(): string;

  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  regionsMap(): { [key: string]: string } {
    return {};
  }

  mapRegions(fragment: DocumentFragment) {
    const regionsMap = this.regionsMap();
    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const el = fragment.querySelector(selector);
      if (el) {
        this.regions[key] = el;
      }
    }
  }

  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  onRender(): void {}

  private bindModel() {
    this.model.on("change", (): void => {
      this.render();
    });
  }

  private bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();
    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(":");
      fragment.querySelectorAll(selector).forEach((el) => {
        el.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  render(): void {
    this.parent.innerHTML = "";

    const templateEl = document.createElement("template");
    templateEl.innerHTML = this.template();
    this.bindEvents(templateEl.content);

    // map and render 'regions' (nested child elements)
    this.mapRegions(templateEl.content);
    this.onRender();

    this.parent.appendChild(templateEl.content);
  }
}
