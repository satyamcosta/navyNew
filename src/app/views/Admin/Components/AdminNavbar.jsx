import { makeStyles, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../Styles/AdminNav.css";

const useStyles = makeStyles({
  root: {
    padding: "0px 0px",
    minHeight: "39.1px",
    lineHeight: 0,
  },
  wrapped: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
});

const AdminNavbar = ({ changeNavigation, SelectedTab }) => {
  const currentUser = useSelector((state) => state.user.currentUserRole);
  const { t } = useTranslation();
  const cls = useStyles();

  let isSuperAdmin = currentUser.superAdmin
  
    const isAdmin = currentUser.admin


  
  const filteredRoutes = AdminRoutes.filter((tab) => {
    if (isSuperAdmin) {
      return true; // Show all tabs for super admin
    } else if (isAdmin && tab.name === "Department") {
      return false;

      // Hide 'Department' tab for admin
    } else if (isAdmin) {
      return true; // Show all other tabs for admin
    }
    return false; // Hide all tabs for non-admin and non-superadmin users
  });

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={SelectedTab}
        onChange={changeNavigation}
        aria-label="Vertical tabs example"
      >
        {filteredRoutes.map((tab) => (
          <Tab
            key={tab.id}
            label={t(tab.name)}
            {...TabProps(tab.id)}
            classes={{
              wrapper: cls.wrapped,
              root: cls.root,
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

function TabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const AdminRoutes = [
  { id: 0, name: "Department" },
  { id: 1, name: "roles" },
  { id: 2, name: "users" },
];

export default AdminNavbar;
