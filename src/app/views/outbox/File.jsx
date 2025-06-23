import React, { Component, Fragment } from "react";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Breadcrumb } from "../../../matx";
import OutboxTable from "./shared/OutboxTable";
import { Loading } from "./therme-source/material-ui/loading";
import { withTranslation } from "react-i18next";
import { clearCookie } from "utils";

class Outbox1 extends Component {
  state = {
    loading: false,
    isMonitor: false,
  };

  handleMonitor = (val) => {
    this.setState({
      isMonitor: val,
    });
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
        <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumb />
            </Grid>
          </Grid>
          <div style={{ marginTop: "-13px" }}>
            <Grid container>
              <Grid item xs={12} className="outbox-table">
                <OutboxTable
                  isMonitor={this.state.isMonitor}
                  handleMonitor={this.handleMonitor}
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
