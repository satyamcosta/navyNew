import React, { Component, Fragment } from "react";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Breadcrumb } from "../../../matx";
import OutboxTable from "./shared/OutboxTable";
import { Loading } from "./therme-source/material-ui/loading";
import { withTranslation } from "react-i18next";
import { clearCookie } from "utils";
import OutvertTable from "./shared/OutvertTable";

class Outbox1 extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    sessionStorage.removeItem("route");
    clearCookie();
  }

  render() {
    let { theme } = this.props;
    const { loading } = this.state;

    return (
      <>
        {loading && <Loading />}
        <div style={{ padding: "8px" }}>
          {/* <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumb
                routeSegments={[
                  {
                    name: this.props.t("outvertRegister"),
                    path: "/eoffice/outvert/register",
                  },
                ]}
              />
            </Grid>
          </Grid> */}
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "10px",
            }}
          >
            <Grid container>
              <Grid item xs={12} className="outvert-register-table">
                <OutvertTable
                  invert={false}
                  blnEnableLoader={(val) => this.setState({ loading: val })}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles({}, { withTheme: true })(withTranslation()(Outbox1));
