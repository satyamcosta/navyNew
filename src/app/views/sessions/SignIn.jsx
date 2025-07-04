import React, { Component } from "react";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  withStyles,
  CircularProgress
} from "@material-ui/core";
// import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";

import { loginWithEmailAndPassword } from "../../redux/actions/LoginActions";

const styles = theme => ({
  wrapper: {
    position: "relative"
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

class SignIn extends Component {
  state = {
    email: "demo",
    password: "demo",
    agreement: ""
  };
  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleFormSubmit = event => {
    this.props.loginWithEmailAndPassword({ ...this.state });
  };
  handleFormSubmit = event => {
    this.props.loginWithEmailAndPassword({ ...this.state });
    sessionStorage.setItem("username", "demo");
  };
  render() {
    let { email, password } = this.state;
    let { classes } = this.props;
    return (
        <div className="signup flex flex-center w-100 h-100vh">
          <div className="p-8">
            <Card className="signup-card position-relative y-center">
              <Grid container>
                <Grid item lg={5} md={5} sm={5} xs={12}>
                  <div className="p-32 flex flex-center flex-middle h-100">
                    <img src={process.env.PUBLIC_URL+"/assets/images/illustrations/bg-indian-navy-login.svg"} alt="paperless_office" loading="lazy"/>
                  </div>
                </Grid>
                <Grid item lg={7} md={7} sm={7} xs={12}>
                  <div className="p-36 h-100 bg-light-gray position-relative">
                   
                  </div>
                </Grid>
              </Grid>
            </Card>
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  login: state.login
});
export default withStyles(styles, { withTheme: true })(
    withRouter(
        connect(
            mapStateToProps,
            { loginWithEmailAndPassword }
        )(SignIn)
    )
);