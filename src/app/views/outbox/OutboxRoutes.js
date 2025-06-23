import { authRoles } from "../../auth/authRoles";
// import {MatxLoadable} from "../../../matx";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const File = Loadable(() => import("./File"), {
  fallback: <Loading />,
});

const InvertRegister = Loadable(() => import("./invertRegister"), {
  fallback: <Loading />,
});

const OutvertRegister = Loadable(() => import("./outvertRegister"), {
  fallback: <Loading />,
});

const outboxRoutes = [
  {
    name: "Outbox",
    path: "/eoffice/outbox/file",
    component: File,
    auth: authRoles.admin,
  },
  {
    name: "InvertRegister",
    path: "/eoffice/invert/register",
    component: InvertRegister,
    auth: authRoles.admin,
  },
  {
    name: "Outbox",
    path: "/eoffice/outvert/register",
    component: OutvertRegister,
    auth: authRoles.admin,
  },
];

export default outboxRoutes;
