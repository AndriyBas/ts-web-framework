import { Collection } from "../models/Collection";
import { HasId, Model } from "../models/Model";
import { View } from "./View";

export abstract class CollectionView<T, K> {
  abstract renderItem(model: T, itemParent: Element): void;

  constructor(public parent: Element, public collection: Collection<T, K>) {}

  render(): void {
    this.parent.innerHTML = "";
    const templateEl = document.createElement("template");
    for (let model of this.collection.models) {
      const itemParent = document.createElement("div");
      this.renderItem(model, itemParent);
      templateEl.content.appendChild(itemParent);
    }
    this.parent.appendChild(templateEl.content);
  }
}
