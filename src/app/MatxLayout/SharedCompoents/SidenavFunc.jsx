import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import MatxVerticalNav from "../../../matx/components/MatxVerticalNav/MatxVerticalNav";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";
import KitchenIcon from "@material-ui/icons/Kitchen";
import DashboardIcon from "@material-ui/icons/Dashboard";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import NoteIcon from "@material-ui/icons/Note";
import { loadUserRoleData } from "app/camunda_redux/redux/action";
import AppContext from "app/appContext";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const paOnly = [
  {
    name: "dashboard",
    path: "/eoffice/dashboard/analytics",
    icon: <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "pa",
    path: "/eoffice/personnel/file",
    icon: (
      <Typography
        variant="h6"
        style={{ fontWeight: "bolder", marginTop: "-2px" }}
      >
        P
      </Typography>
    ),
  },
]; // this will contain only pa navigation

const allNavs = [
  {
    name: "dashboard",
    path: "/eoffice/dashboard/app",
    icon: <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "inbox",
    path: "/eoffice/inbox/file",
    icon: <DraftsRoundedIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "outbox",
    path: "/eoffice/outbox/file",
    icon: <OpenInBrowserIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "action_point",
    path: "/eoffice/actionpoint",
    icon: <CallToActionIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "initiate",
    path: "/eoffice/correspondence/file",
    icon: <NoteIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "cabinet",
    path: "/eoffice/cabinet/file",
    icon: <KitchenIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
]; // this will contain all navigations my app provides

const mrNavs = [
  {
    name: "inbox",
    path: "/eoffice/inbox/file",
    icon: <DraftsRoundedIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "waitinginbox",
    path: "/eoffice/waiting/inbox",
    icon: <DraftsRoundedIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "invertRegister",
    path: "/eoffice/invert/register",
    icon: <OpenInBrowserIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "outvertRegister",
    path: "/eoffice/outvert/register",
    icon: <MoveToInboxIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
  {
    name: "initiate",
    path: "/eoffice/correspondence/file",
    icon: <NoteIcon fontSize="small" style={{ marginTop: "-10px" }} />,
  },
];

const adminNav = [
  {
    name: "admin",
    path: "/eoffice/department/admin",
    icon: (
      <SupervisorAccountIcon fontSize="small" style={{ marginTop: "-10px" }} />
    ),
  },
];

const showNavs = allNavs; // this will contain navigation out of above 2 to show in app

const SidenavFunc = (props) => {
  const { appRoutes, showHam, toggleHam, isAdmin } = props;
  const history = useHistory();
  const { LicenseConfig } = useContext(AppContext);
  const { t } = useTranslation();

  const [showNavigation, setShowNavigation] = useState(showNavs);
  const [allNavigations, setAllNavigations] = useState(allNavs);

  useEffect(() => {
    const validNavigations = allNavigations.filter((nav, ind) => {
      if (LicenseConfig?.hideRoutes?.includes(nav.path)) return false;
      else return true;
    });
    setAllNavigations(validNavigations);
  }, []);

  useEffect(() => {
    console.log(isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setShowNavigation(allNavs.concat(adminNav));
    } else if (
      appRoutes.showPa &&
      !appRoutes.showAll &&
      showNavigation.length > 2
    ) {
      setShowNavigation(paOnly);
      history.push("/eoffice/dashboard/analytics");
    } else if (
      !appRoutes.showPa &&
      appRoutes.showAll &&
      showNavigation.length >= 2
    ) {
      setShowNavigation(allNavs);
      history.push("/eoffice/inbox/file");
    } else if (!appRoutes.showPa && !appRoutes.showAll && appRoutes.showMr) {
      setShowNavigation(mrNavs);
      history.push("/eoffice/inbox/file");
    }
  }, [appRoutes, isAdmin]);

  const updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = props;
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    setLayoutSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  const renderOverlay = () => (
    <div
      onClick={() => updateSidebarMode({ mode: "close" })}
      className="sidenav__overlay"
    />
  );

  return (
    <>
      {props.children}
      <MatxVerticalNav
        navigation={showNavigation}
        showHam={showHam}
        toggleHam={toggleHam}
      />
    </>
  );
};

SidenavFunc.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  settings: state.layout.settings,
  isAdmin: state.user.currentUserRole?.admin,
  appRoutes: state.appRoutes,
});

export default withRouter(
  connect(mapStateToProps, {
    setLayoutSettings,
    loadUserRoleData,
  })(SidenavFunc)
);
