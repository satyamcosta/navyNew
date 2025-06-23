import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import MatxVerticalNav from "../../../matx/components/MatxVerticalNav/MatxVerticalNav";
import { withTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";
import { SupervisedUserCircle } from "@material-ui/icons";
import KitchenIcon from "@material-ui/icons/Kitchen";
import DashboardIcon from "@material-ui/icons/Dashboard";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded";
import NoteIcon from "@material-ui/icons/Note";
import { loadUserRoleData } from "app/camunda_redux/redux/action";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import AppContext from "app/appContext";

class Sidenav extends Component {
  constructor(props, context) {
    super(props);

    const { t } = props;
    let { LicenseConfig } = context;
    const allNavigations = [
      // {
      //   name: "dashboard",
      //   path: "/eoffice/dashboard/analytics",
      //   icon: <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      {
        name: "inbox",
        path: "/eoffice/inbox/file",
        // icon: (
        //   <DraftsRoundedIcon fontSize="small" style={{ marginTop: "-10px" }} />
        // ),
        icon: (
          <svg
            fill="#000000"
            height="18px"
            width="18px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 512.039 512.039"
          >
            <g transform="translate(-1)">
              <g>
                <g>
                  <path
                    d="M512.606,315.853c-0.018-0.089-0.036-0.178-0.055-0.266c-0.129-0.599-0.278-1.198-0.462-1.797
				c-0.049-0.161-0.109-0.316-0.161-0.475c-0.087-0.262-0.169-0.525-0.267-0.786l-64-170.667
				c-3.122-8.326-11.082-13.843-19.975-13.843h-64c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333
				h49.216l48,128h-97.216c-11.782,0-21.333,9.551-21.333,21.333v42.667H171.686v-42.667c0-11.782-9.551-21.333-21.333-21.333
				H53.137l48-128h49.216c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-64
				c-8.893,0-16.853,5.516-19.975,13.843l-64,170.667c-0.098,0.261-0.179,0.522-0.266,0.784c-0.053,0.16-0.113,0.316-0.162,0.478
				c-0.184,0.598-0.332,1.197-0.462,1.796c-0.019,0.089-0.037,0.178-0.055,0.268c-0.332,1.639-0.466,3.273-0.413,4.879v169.954
				c0,11.782,9.551,21.333,21.333,21.333h469.333c11.782,0,21.333-9.551,21.333-21.333V320.733
				C513.072,319.127,512.939,317.493,512.606,315.853z M470.353,469.353H43.686v-128h85.333v42.667
				c0,11.782,9.551,21.333,21.333,21.333h213.333c11.782,0,21.333-9.551,21.333-21.333v-42.667h85.333V469.353z"
                  />
                  <path
                    d="M177.934,228.438l64,64c0.004,0.004,0.008,0.006,0.011,0.01c0.494,0.493,1.012,0.96,1.552,1.403
				c0.247,0.203,0.507,0.379,0.761,0.569c0.303,0.227,0.6,0.462,0.915,0.673c0.304,0.203,0.619,0.379,0.93,0.565
				c0.286,0.171,0.565,0.35,0.86,0.508c0.317,0.17,0.643,0.313,0.967,0.466c0.308,0.145,0.61,0.299,0.925,0.43
				c0.314,0.13,0.635,0.235,0.953,0.349c0.338,0.122,0.672,0.251,1.018,0.356c0.318,0.096,0.642,0.167,0.964,0.248
				c0.353,0.089,0.701,0.188,1.061,0.259c0.372,0.074,0.748,0.117,1.122,0.171c0.314,0.045,0.622,0.105,0.941,0.136
				c0.693,0.068,1.388,0.105,2.083,0.105c0.007,0,0.015,0.001,0.022,0.001s0.015-0.001,0.022-0.001
				c0.695-0.001,1.39-0.037,2.083-0.105c0.318-0.031,0.627-0.091,0.941-0.136c0.375-0.054,0.75-0.097,1.122-0.171
				c0.359-0.071,0.708-0.17,1.061-0.259c0.322-0.081,0.645-0.152,0.964-0.248c0.346-0.105,0.68-0.234,1.018-0.356
				c0.318-0.114,0.639-0.219,0.953-0.349c0.315-0.131,0.618-0.284,0.925-0.43c0.324-0.153,0.65-0.296,0.967-0.466
				c0.294-0.158,0.574-0.337,0.86-0.508c0.311-0.186,0.626-0.362,0.93-0.565c0.315-0.211,0.612-0.446,0.915-0.673
				c0.254-0.19,0.514-0.366,0.761-0.569c0.54-0.443,1.059-0.91,1.552-1.403c0.004-0.004,0.008-0.006,0.011-0.01l64-64
				c8.331-8.331,8.331-21.839,0-30.17c-8.331-8.331-21.839-8.331-30.17,0l-27.582,27.582V21.353
				c0-11.782-9.551-21.333-21.333-21.333c-11.782,0-21.333,9.551-21.333,21.333v204.497l-27.582-27.582
				c-8.331-8.331-21.839-8.331-30.17,0C169.603,206.599,169.603,220.106,177.934,228.438z"
                  />
                </g>
              </g>
            </g>
          </svg>
        ),
      },
      {
        name: "outbox",
        path: "/eoffice/outbox/file",
        // icon: (
        //   <OpenInBrowserIcon fontSize="small" style={{ marginTop: "-10px" }} />
        // ),
        icon: (
          <svg
            fill="#000000"
            height="18px"
            width="18px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 512.039 512.039"
          >
            <g transform="translate(-1)">
              <g>
                <g>
                  <path
                    d="M512.606,315.853c-0.018-0.089-0.036-0.178-0.055-0.266c-0.129-0.599-0.278-1.198-0.462-1.797
				c-0.049-0.161-0.109-0.316-0.161-0.475c-0.087-0.262-0.169-0.525-0.267-0.786l-64-170.667
				c-3.122-8.326-11.082-13.843-19.975-13.843h-64c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333
				h49.216l48,128h-97.216c-11.782,0-21.333,9.551-21.333,21.333v42.667H171.686v-42.667c0-11.782-9.551-21.333-21.333-21.333
				H53.137l48-128h49.216c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-64
				c-8.893,0-16.853,5.516-19.975,13.843l-64,170.667c-0.098,0.261-0.179,0.522-0.266,0.784c-0.053,0.16-0.113,0.316-0.162,0.478
				c-0.184,0.598-0.332,1.197-0.462,1.796c-0.019,0.089-0.037,0.178-0.055,0.268c-0.332,1.639-0.466,3.273-0.413,4.879v169.954
				c0,11.782,9.551,21.333,21.333,21.333h469.333c11.782,0,21.333-9.551,21.333-21.333V320.733
				C513.072,319.127,512.939,317.493,512.606,315.853z M470.353,469.353H43.686v-128h85.333v42.667
				c0,11.782,9.551,21.333,21.333,21.333h213.333c11.782,0,21.333-9.551,21.333-21.333v-42.667h85.333V469.353z"
                  />
                  <path
                    d="M208.104,100.438l27.582-27.582v204.497c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333
				V72.856l27.582,27.582c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17l-64-64
				c-0.004-0.004-0.008-0.006-0.011-0.01c-0.494-0.493-1.012-0.96-1.552-1.403c-0.247-0.203-0.507-0.379-0.761-0.569
				c-0.303-0.227-0.6-0.462-0.916-0.673c-0.304-0.203-0.619-0.379-0.931-0.565c-0.286-0.171-0.565-0.35-0.859-0.508
				c-0.318-0.17-0.644-0.314-0.969-0.467c-0.307-0.145-0.609-0.298-0.923-0.429c-0.315-0.13-0.637-0.236-0.957-0.35
				c-0.337-0.121-0.669-0.25-1.013-0.354c-0.32-0.097-0.646-0.168-0.969-0.249c-0.351-0.089-0.698-0.187-1.055-0.258
				c-0.375-0.074-0.753-0.119-1.13-0.173c-0.311-0.044-0.617-0.104-0.933-0.135c-1.4-0.138-2.811-0.138-4.211,0
				c-0.315,0.031-0.621,0.09-0.933,0.135c-0.377,0.054-0.756,0.098-1.13,0.173c-0.358,0.071-0.704,0.169-1.055,0.258
				c-0.324,0.081-0.649,0.152-0.969,0.249c-0.344,0.104-0.677,0.233-1.013,0.354c-0.32,0.115-0.642,0.22-0.957,0.35
				c-0.315,0.13-0.616,0.284-0.923,0.429c-0.324,0.153-0.651,0.297-0.969,0.467c-0.294,0.158-0.573,0.337-0.859,0.508
				c-0.312,0.186-0.627,0.362-0.931,0.565c-0.316,0.211-0.612,0.446-0.916,0.673c-0.254,0.19-0.514,0.366-0.761,0.569
				c-0.54,0.443-1.059,0.91-1.552,1.403c-0.004,0.004-0.008,0.006-0.011,0.01l-64,64c-8.331,8.331-8.331,21.839,0,30.17
				S199.773,108.769,208.104,100.438z"
                  />
                </g>
              </g>
            </g>
          </svg>
        ),
      },
      // {
      //   name: "pa",
      //   path: "/eoffice/personnel/file",
      //   icon: (
      //     <Typography
      //       variant="h6"
      //       style={{ fontWeight: "bolder", marginTop: "-2px" }}
      //     >
      //       P
      //     </Typography>
      //   ),
      // },
      {
        name: "initiate",
        path: "/eoffice/correspondence/file",
        icon: <NoteIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      },
      // {
      //   name: "file",
      //   path: "/eoffice/File/file",
      //   icon: (
      //     <DescriptionIcon fontSize="small" style={{ marginTop: "-10px" }} />
      //   ),
      // },
      // {
      //   name: t("initiate"),
      //   path: "/eoffice/initiate/file",
      //   icon: <Tooltip title={t("initiate")} aria-label="Initiate"><ViewQuiltIcon fontSize="normal" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      // {
      //   name: t("DMS"),
      //   path: "/eoffice/dms/DmsFolderStructure",
      //   icon: <Tooltip title={t("dms")} aria-label="DMS"><FolderIcon fontSize="small" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      {
        name: "cabinet",
        path: "/eoffice/cabinet/file",
        icon: <KitchenIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      },

      {
        name: t("ACTION POINTS"),
        path: "/eoffice/actionpoint",
        icon: (
          <CallToActionIcon fontSize="small" style={{ marginTop: "-10px" }} />
        ),
      },

      // {
      //   name: "ADMIN",
      //   path: "/eoffice/admin/dashboard",
      //   icon: (
      //     <SupervisedUserCircle
      //       fontSize="small"
      //       style={{ marginTop: "-10px" }}
      //     />
      //   ),
      //   hide: true,
      // },
      // {
      //   name: "search",
      //   path: "/eoffice/search",
      //   icon: <SearchIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      // {
      //   name: "admin",
      //   path: "/eoffice/admin/dashboard",
      //   icon: (
      //     <SupervisedUserCircle
      //       fontSize="small"
      //       style={{ marginTop: "-10px" }}
      //     />
      //   ),
      // },
      // {
      //   name: "RTI",
      //   path: "/eoffice/rti/file",
      //   icon: <Class fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      // {
      //   name: "MEETING",
      //   path: "/eoffice/Meeting/meetingschedule",
      //   icon: (
      //     <ContactMailIcon fontSize="small" style={{ marginTop: "-10px" }} />
      //   ),
      // },
    ];
    this.state = {
      allNavigations, // this will contain all navigations my app provides
      onlyPa: [
        {
          name: "dashboard",
          path: "/eoffice/dashboard/analytics",
          icon: (
            <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />
          ),
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

        // {
        //   name: "ADMIN",
        //   path: "/eoffice/admin/dashboard",
        //   icon: (
        //     <SupervisedUserCircle
        //       fontSize="small"
        //       style={{ marginTop: "-10px" }}
        //     />
        //   ),
        //   hide: true,
        // },
      ], // this will contain only pa navigation
      showNavigation: [
        {
          name: "dashboard",
          path: "/eoffice/dashboard/analytics",
          icon: (
            <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />
          ),
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

        // {
        //   name: t("ACTION POINTS"),
        //   path: "/eoffice/actionpoint",
        //   icon: (
        //     <CallToActionIcon fontSize="small" style={{ marginTop: "-10px" }} />
        //   ),
        // },
        // {
        //   name: "ADMIN",
        //   path: "/eoffice/admin/dashboard",
        //   icon: (
        //     <SupervisedUserCircle
        //       fontSize="small"
        //       style={{ marginTop: "-10px" }}
        //     />
        //   ),
        //   hide: true,
        // },
      ], // this will contain navigation out of above 2 to show in app
    };
  }

  componentDidMount() {
    let { LicenseConfig } = this.context;
    const validNavigations = this.state.allNavigations.filter((nav, ind) => {
      if (LicenseConfig?.hideRoutes?.includes(nav.path)) return false;
      else return true;
    });
    this.setState({
      allNavigations: validNavigations,
    });
  }

  componentDidUpdate() {
    const role = sessionStorage.getItem("role");
    const mrRole = sessionStorage.getItem("mrRole");
    const { appRoutes } = this.props;
    // if (
    //   isAdmin &&
    //   this.state.allNavigations[this.state.allNavigations.length - 1].path !==
    //     "/eoffice/auditsearch"
    // ) {
    //   const adminNav = {
    //     name: t("AUDITSEARCH"),
    //     path: "/eoffice/auditsearch",
    //     icon: <ReceiptIcon fontSize="small" style={{ marginTop: "-10px" }} />,
    //   };
    //   this.setState({
    //     allNavigations: [...this.state.allNavigations, adminNav],
    //   });
    // }
    if (
      appRoutes.showPa &&
      !appRoutes.showAll &&
      this.state.showNavigation.length > 2
    ) {
      this.setState({
        showNavigation: this.state.onlyPa,
      });
    } else if (
      !appRoutes.showPa &&
      appRoutes.showAll &&
      (this.state.showNavigation.length == 2 ||
        this.state.showNavigation.length == 1) &&
      mrRole !== role
    ) {
      this.setState({
        showNavigation: this.state.allNavigations,
      });
    } else if (
      mrRole == role &&
      !appRoutes.showPa &&
      appRoutes.showAll &&
      this.state.showNavigation.length >= 2
    ) {
      this.setState({
        showNavigation: [
          {
            name: "inbox",
            path: "/eoffice/inbox/file",
            icon: (
              <DraftsRoundedIcon
                fontSize="small"
                style={{ marginTop: "-10px" }}
              />
            ),
          },
          // {
          //   name: "outbox",
          //   path: "/eoffice/outbox/file",
          //   icon: (
          //     <OpenInBrowserIcon
          //       fontSize="small"
          //       style={{ marginTop: "-10px" }}
          //     />
          //   ),
          // },
        ],
      });
    }
  }

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
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

  renderOverlay = () => (
    <div
      onClick={() => this.updateSidebarMode({ mode: "close" })}
      className="sidenav__overlay"
    />
  );
  render() {
    const { showHam, toggleHam } = this.props;

    return (
      <Fragment>
        {this.props.children}
        <MatxVerticalNav
          navigation={this.state.showNavigation}
          showHam={showHam}
          toggleHam={toggleHam}
        />
      </Fragment>
    );
  }
}

Sidenav.contextType = AppContext;

Sidenav.propTypes = {
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
  })(withTranslation()(Sidenav))
);
