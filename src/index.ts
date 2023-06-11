import { Collection } from "./models/Collection";
import { User, UserProps } from "./models/User";
import { UserEdit } from "./views/UserEdit";
import { UserForm } from "./views/UserForm";
import { UserList } from "./views/UserList";
import { UserShow } from "./views/UserShow";

const u = User.buildUser({ id: 1 });

u.on("change", () => {
  console.log("changed called");
  console.log(u);
});

u.fetch();

const u2 = User.buildUser({ name: "Sun", age: 99 });
// u2.save().then(() => {
//   console.log(u2);
// });

const users = User.buildUserCollection();
users.on("change", () => {
  console.log(users.models);
});
users.fetch();

const user = User.buildUser({ name: "NAME", age: 20 });
const root = document.getElementById("root");

if (root) {
  // const show = new UserShow(root, user);
  // const form = new UserForm(root, user);
  // show.render();
  // form.render();

  // const userEdit = new UserEdit(root, user);
  // userEdit.render();

  const users = new Collection<User, UserProps>(
    "http://localhost:3000/users",
    (json) => User.buildUser(json)
  );
  users.on("change", () => {
    console.log(users);
    const list = new UserList(root, users);
    list.render();
  });
  users.fetch().then(() => {});
} else {
  throw new Error("'#root' element is not found!");
}
