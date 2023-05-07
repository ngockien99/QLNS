import { roleAdmin } from "./route-config-admin";
import { roleStaff } from "./route-config-staff";

const getRoutes = (role) => {
  const roleType = getMenu(role);
  return roleType?.flatMap((i) => i.items);
};

const getMenu = (role) => {
  switch (role) {
    case "admin":
      return roleAdmin();
    case "staff":
      return roleStaff();
    default:
      return null;
  }
};

export { getMenu, getRoutes };
