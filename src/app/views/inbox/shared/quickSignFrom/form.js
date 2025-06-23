import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  Collapse,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { loadUserRoleData } from "app/camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import { Check, Create, Done } from "@material-ui/icons";
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import { debounce } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import SignPens from "app/views/Personnel/quickSignFrom/SignPens";

const useStyles = makeStyles((theme) => ({
  red: {
    color: theme ? "#fd3f3f" : "red",
  },
  green: {
    color: theme ? "lime" : "green",
  },
  blue: {
    color: theme ? "#3080ff" : "blue",
  },
  black: {
    color: "#808080",
  },
  checkbox: {
    margin: 0,
    display: "flex",
    gap: "0.4rem",
  },
  table: {
    minWidth: "350px",
  },
}));

const FormikEyesOnlyGroup = ({
  field,
  name,
  options,
  children,
  theme,
  t,
  ...props
}) => {
  const dispatch = useDispatch();

  const { setFieldValue } = props.form;
  const fieldName = name || field.name;
  const [roleArr, setroleArr] = useState([]);
  const [selectedRoles, setselectedRoles] = useState([]);

  const handleChange = (val) => {
    if (val.length == 0) {
      setselectedRoles(val);
      setFieldValue("sendTo", val);
    } else {
      const newVal = val[val.length - 1];
      console.log(newVal);
      if (newVal && typeof newVal === "object" && "id" in newVal) {
        setselectedRoles(val);
        setFieldValue("sendTo", val);
      }
    }
  };

  const handleInputChange = (newValue) => {
    if (newValue && newValue.length >= 3) {
      let tmpArr = [];
      props
        .loadUserRoleData(newValue)
        .then((resp) => {
          if (resp.error) {
            // callMessageOut("error", resp.error);
            return;
          } else {
            setroleArr(resp.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const optimizedInternalService = useCallback(debounce(handleInputChange), []);

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  return (
    <div
      style={{
        margin: "0.6rem 0rem",
      }}
      className="eyes_only_container"
    >
      <FormControl style={{ width: "100%" }}>
        <Autocomplete
          freeSolo
          multiple
          disableCloseOnSelect
          options={roleArr}
          getOptionLabel={(option) => {
            return typeof option === "object"
              ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
              : "";
          }}
          id="tags-outlined"
          value={selectedRoles}
          onChange={(event, newValue) => {
            console.log(newValue);
            handleChange(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            optimizedInternalService(newInputValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              style={{ width: "100%" }}
              variant="outlined"
              label={t("search_by_service_number")}
              placeholder={t("enter_service_number")}
            />
          )}
        />
      </FormControl>
    </div>
  );
};

const FormikRadioGroup = ({
  field,
  name,
  options,
  children,
  theme,
  t,
  ...props
}) => {
  const fieldName = name || field.name;

  const classes = useStyles();
  const renderOptions = (options) => {
    return options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio color={theme ? "default" : "primary"} />}
        label={option}
        className={
          option === t("red")
            ? classes.red
            : option === t("green")
            ? classes.green
            : option === t("black")
            ? classes.black
            : classes.blue
        }
      />
    ));
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <FormLabel
        component="legend"
        style={{ display: "flex", color: theme ? "" : "black" }}
      >
        {t("color")}
      </FormLabel>
      <RadioGroup
        {...field}
        // {...props}
        value={props.value}
        name={fieldName}
        style={{ position: "relative", display: "table-cell" }}
      >
        {options ? renderOptions(options) : children}
      </RadioGroup>
    </div>
  );
};

const FormikToggleBtnGroup = ({
  field,
  name,
  options,
  children,
  value,
  theme,
  t,
  ...props
}) => {
  const formik = props.form;
  const fieldName = name || field.name;

  const classes = useStyles();
  const renderOptions = (options) => {
    return options.map((option, i) => (
      <ToggleButton value={option} key={i}>
        <Tooltip title={option}>
          <Box height="25px" width="25px" bgcolor={option}></Box>
        </Tooltip>
      </ToggleButton>
    ));
  };

  return (
    <div
      style={{
        margin: "20px 0px",
        display: "flex",
        gap: "3rem",
        alignItems: "center",
      }}
    >
      <FormLabel
        component="legend"
        style={{ display: "flex", color: theme ? "" : "black" }}
      >
        {t("color")} :
      </FormLabel>
      <SignPens
        checkedColor={value}
        handleChange={(v) => {
          sessionStorage.setItem("penColor", v);
          formik.setFieldValue(fieldName, v);
        }}
      />
      {/* <ToggleButtonGroup
        id="sign_toggle_group"
        orientation="horizontal"
        size="medium"
        value={value}
        exclusive
        name={fieldName}
        onChange={(e, v) => v && formik.setFieldValue(fieldName, v)}
        style={{
          margin: "auto",
        }}
      >
        {options ? renderOptions(options) : children}
      </ToggleButtonGroup> */}
    </div>
  );
};

const Form = (props) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const classses = useStyles();
  const {
    values: { comments, pencilColorCode, eyesOnly, sendTo },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isYloNote,
  } = props;

  const options = [t("red"), t("green"), t("blue"), t("black")];

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent
        dividers
        style={{
          padding: isYloNote ? "0 1rem" : "",
        }}
      >
        {isYloNote && (
          <FormControlLabel
            control={
              <Checkbox
                checked={eyesOnly}
                onChange={handleChange}
                name="eyesOnly"
                color={props.theme ? "default" : "primary"}
              />
            }
            label="Eyes Only"
            className={classses.checkbox}
          />
        )}
        {isYloNote && (
          <Collapse in={eyesOnly}>
            <Field
              name="sendTo"
              value={sendTo}
              loadUserRoleData={props.loadUserRoleData}
              component={FormikEyesOnlyGroup}
              helpertext={touched.sendTo ? errors.sendTo : ""}
              error={Boolean(errors.sendTo)}
              theme={theme}
              t={t}
            />
            <div
              style={{ fontSize: "small", color: "red", textAlign: "start" }}
            >
              {touched.sendTo && Boolean(errors.sendTo) ? errors.sendTo : ""}
            </div>
          </Collapse>
        )}

        <TextField
          name="comments"
          error={touched.comments ? Boolean(errors.comments) : false}
          label={isYloNote ? t("yellow_note") : t("comment")}
          value={comments || ""}
          onChange={handleChange}
          // inputProps={{ maxLength: 250 }}
          fullWidth
          multiline
          minRows={isYloNote ? 2 : 10}
          variant="outlined"
          className={props.theme ? "darkTextField" : ""}
        />

        <div style={{ fontSize: "small", color: "red", textAlign: "start" }}>
          {touched.comments && Boolean(errors.comments) ? errors.comments : ""}
        </div>

        <Field
          name="pencilColorCode"
          value={pencilColorCode}
          options={options}
          component={FormikToggleBtnGroup}
          helpertext={touched.pencilColorCode ? errors.pencilColorCode : ""}
          error={Boolean(errors.pencilColorCode)}
          theme={theme}
          t={t}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.pencilColorCode) ? errors.pencilColorCode : ""}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          id="inboxSign_button"
          type="submit"
          variant="contained"
          color="secondary"
          disabled={props.blnDisable}
          endIcon={isYloNote ? <Done /> : <Create />}
        >
          {isYloNote ? t("save") : t("sign")}
        </Button>
      </DialogActions>
    </form>
  );
};

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, { loadUserRoleData })(Form);

// NOTE:::

// when working with mui checkbox note that if u want e.target.checked value or onChange to execute then do not change the default mui css of checkbox otherwise some bug will come
