import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import EDashboardLayout from "./Components/EDashboardLayout";

const eDashboard = () => {
  const { t } = useTranslation();
  return (
    <>
      <div
        style={{
          padding: "1px 0",
          margin: "2px 10px 0px 10px",
          minHeight: "92vh",
        }}
      >
        <div>
          {/*
            <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={4}>
              <Breadcrumb />
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
            */}
        </div>
        <EDashboardLayout />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(eDashboard);
