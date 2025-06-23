import { authRoles } from "../../../auth/authRoles";

import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./File"), {
  fallback: <Loading />,
});

const actionPointRoutes = [
  {
    path: "/eoffice/actionpoint",
    component: File,
    auth: authRoles.admin,
    name: "Actionpoint",
  },
];

export default actionPointRoutes;
