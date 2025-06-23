// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const AdminPage = Loadable(() => import("./index"), {
  fallback: <Loading />,
});

const Administrator = [
  {
    name: "Admin",
    path: "/eoffice/department/admin",
    component: AdminPage,
    auth: authRoles.admin,
  },
];

export default Administrator;
