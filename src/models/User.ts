import { Eventing } from "./Eventing";
import { ApiSync } from "./ApiSync";
import { Attributes } from "./Attributes";
import { Model } from "./Model";
import { Collection } from "./Collection";

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const ROOT_URL = "http://localhost:3000/users";

export class User extends Model<UserProps> {
  static buildUser(data: UserProps): User {
    return new User(
      new Attributes<UserProps>(data),
      new ApiSync<UserProps>(ROOT_URL),
      new Eventing()
    );
  }

  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection(ROOT_URL, (props: UserProps) =>
      User.buildUser(props)
    );
  }

  // constructor(data: UserProps) {
  //   super(
  //     new Attributes<UserProps>(data),
  //     new Eventing(),
  //     new ApiSync<UserProps>(ROOT_URL)
  //   );
  // }
  get fullName(): string {
    return this.get("name") ?? "";
  }

  setRandomAge(): void {
    const age = Math.round(Math.random() * 100);
    console.log("setRandomAge: ", age);
    this.set({ age });
  }
}
