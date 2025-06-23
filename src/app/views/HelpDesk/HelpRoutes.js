// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const HelpPage = Loadable(() => import("./index"), {
  fallback: <Loading />,
});

const HelpDesk = [
  {
    name: "Admin",
    path: "/eoffice/user/helpdesk",
    component: HelpPage,
    auth: authRoles.admin,
  },
];

export default HelpDesk;
