import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import SignPens from "./SignPens";
import { Create } from "@material-ui/icons";
import {
  RichTextEditorComponent,
  Toolbar,
  Inject,
  HtmlEditor,
} from "@syncfusion/ej2-react-richtexteditor";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  blue: {
    color: "blue",
  },
  black: {
    color: "black",
  },
}));

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

  const renderOptions = (options) => {
    const classes = useStyles();
    return options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio color={theme ? "default" : "primary"} />}
        label={option}
        style={{ color: { option } }}
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
    <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
      <FormLabel
        component="legend"
        style={{
          display: "flex",
          width: "auto",
          marginRight: "15px",
          color: theme ? "" : "black",
        }}
      >
        {t("color")} :
      </FormLabel>
      <RadioGroup
        {...field}
        {...props}
        name={fieldName}
        color={theme ? "secondary" : "primary"}
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
        <Tooltip title={t(option)}>
          <Box height="25px" width="25px" bgcolor={option}></Box>
        </Tooltip>
      </ToggleButton>
    ));
  };

  return (
    <div
      style={{
        marginTop: "20px",
        marginLeft: "6px",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "start",
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

export const Form = (props) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const editorRef = useRef(null);
  const {
    values: { comments, pencilColorCode },
    errors,
    handleSubmit,
    handleChange,
    blnDisable,
    setFieldValue,
  } = props;

  const options = [t("red"), t("green"), t("blue"), t("black")];

  const [rowHeight, setRowHeight] = useState(12);
  useEffect(() => {
    window.innerWidth >= 1920 ? setRowHeight(12) : setRowHeight(10);
  }, []);
  const toolbarSettings = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "Outdent",
      "Indent",
      "|",
      "Undo",
      "Redo",
    ],
    type: "Scrollable",
  };

  const handleEditorChange = () => {
    if (editorRef?.current) {
      const commentHTML = editorRef.current.getHtml();
      setFieldValue("comments", commentHTML);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <TextField
          name="comments"
          error={Boolean(errors.comments)}
          label={t("comment")}
          value={comments || ""}
          onChange={handleChange}
          inputProps={{ maxLength: 250 }}
          fullWidth
          multiline
          minRows={rowHeight}
          variant="outlined"
          className={theme ? "darkTextField" : ""}
        />
        <Typography
          variant="body1"
          style={{ color: theme ? "white" : "black" }}
        >
          {t("comment")}
        </Typography>
        {/* <RichTextEditorComponent
          name="comments"
          ref={editorRef}
          value={comments}
          change={handleEditorChange}
          toolbarSettings={toolbarSettings}
        >
          <Inject services={[Toolbar, HtmlEditor]} />
        </RichTextEditorComponent> */}
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.comments) ? errors.comments : ""}
        </div>
        <Field
          name="pencilColorCode"
          value={pencilColorCode}
          options={options}
          component={FormikToggleBtnGroup}
          t={t}
          theme={theme}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.pencilColorCode) ? errors.pencilColorCode : ""}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          id="PA_file_form_sign_btn"
          type="submit"
          variant="contained"
          color="secondary"
          disabled={blnDisable}
          endIcon={<Create />}
        >
          {t("sign")}
        </Button>
      </DialogActions>
    </form>
  );
};
