import Cookie from "js-cookie";
import { AbilityBuilder, Ability } from "@casl/ability";
import { useContext } from "react";
import { AbilityContext } from "./Can";

//Updates the permissions if they are not set. Otherwise, it does nothing
function UpdateAbility() {
  const ability = useContext(AbilityContext);

  if (ability.rules.length !== 0) {
    return;
  }

  const { can, rules } = new AbilityBuilder(Ability);

  const token = Cookie.get("token");
  if (token !== undefined) {
    let jwtData = token.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    let userRole = decodedJwtData.role;

    switch (userRole) {
      case "ADMIN":
        can("USER_MANAGEMENT", "users");
        can("create", "all");
        can("edit", "all");
        can("delete", "all");
        can("read", "all");
        break;
      case "NORMAL":
        can("create", "all");
        can("edit", "all");
        can("read", "all");
        break;
      default:
        can("read", "all");
        break;
    }
    ability.update(rules);
  }
}

export { UpdateAbility };
