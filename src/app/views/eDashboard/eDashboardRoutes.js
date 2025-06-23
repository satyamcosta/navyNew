import { authRoles } from "../../auth/authRoles";

import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./index"), {
  fallback: <Loading />,
});

const eDashboardRoutes = [
  {
    path: "/eoffice/dashboard/app",
    component: File,
    auth: authRoles.admin,
    name: "dashboard",
  },
];

export default eDashboardRoutes;
