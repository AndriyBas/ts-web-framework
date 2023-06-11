import { User, UserProps } from "../models/User";
import { View } from "./View";

export class UserForm extends View<User, UserProps> {
  eventsMap(): { [key: string]: () => void } {
    return {
      "click:#changeName": this.onChangeName,
      "click:#setAge": this.onSetAgeClick,
      "click:#save": this.onSaveClick,
    };
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  };

  onSaveClick = (): void => {
    this.model.save();
  };

  onChangeName = (): void => {
    const nameInput = this.parent.querySelector<HTMLInputElement>("#name");
    if (nameInput) {
      this.model.set({ name: nameInput.value });
    }
  };

  template(): string {
    return `
      <div>
        <input id='name' placeholder="${this.model.get("name")}"/>
        <button id='changeName'>Change name</button>
        <button id='setAge'>Set random age</button>
        <button id='save'>Save</button>
      </div>
    `;
  }
}
