import React, { useState } from "react";
import { Formik } from "formik";
import Form from "./form";
import * as Yup from "yup";
import { useSelector, connect, useDispatch } from "react-redux";
import { quickSign } from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import { Loading } from "../../therme-source/material-ui/loading";
import Cookies from "js-cookie";
import { addYlowNote } from "../../../../camunda_redux/redux/action";
import { useContext } from "react";
import { SplitViewContext } from "../SplitviewContainer/Worker";
import { handleError } from "utils";
import { setGateway } from "app/camunda_redux/redux/ducks/GatewayReducer";

const InputForm = (props) => {
  const { t } = useTranslation();
  const context = useContext(SplitViewContext);
  let isBM = context?.tabIndex;
  const personal = useSelector((state) => state.personalizeInfo);

  const [fileURL, setFileURL] = useState("");
  const [blnDisable, setBlnDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    SignURL,
    flagNum,
    isYloNote,
    docId,
    correspondence,
    reference,
    annexure,
  } = props;
  let isRti = Cookies.get("isRti");
  const cabinetPcId = Cookies.get("cabinetpartcase");

  const validationSchema1 = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
  });

  const validationSchema2 = Yup.object({
    comments: Yup.string(t("enter_a_yellow_note"))
      .trim()
      .required(t("yellow_note_is_required")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
    sendTo: Yup.array()
      .of(Yup.string())
      .when("eyesOnly", {
        is: true,
        then: Yup.array().required("Send field is required"),
        otherwise: Yup.array(),
      }),
  });

  const submit1 = (data, action) => {
    setBlnDisable(true);
    setIsLoading(true);
    let body = {
      corrDocId: "",
      annexure: false,
      reference: false,
      application: false,
      flagNumber: 0,
      comments: data.comments
    }
    let formData = {
      comments: encodeURIComponent(data.comments),
      tag: "APPROVED",
      signTitle: sessionStorage.getItem("signTitle"),
      pencilColorCode: data.pencilColorCode,
      username: localStorage.getItem("username"),
      color: data.pencilColorCode,
      personalAppliactionFileId: data.personalAppliactionFileId,
      // dep_desc: encodeURIComponent(sessionStorage.getItem("displayDept")),
      dep_desc: "",
      user_desc: sessionStorage.getItem("displayRole"),
      url: SignURL,
      partCaseFileId: data.personalAppliactionFileId,
    };

    const roleName = sessionStorage.getItem("role");
    const depart = sessionStorage.getItem("department");
    const username = localStorage.getItem("username");

    if (correspondence) {
      body = {
        corrDocId: data.personalAppliactionFileId,
        annexure: false,
        reference: false,
        application: false,
        flagNumber: flagNum,
        comments: data.comments
      };

      if (reference) {
        body.reference = true;
      } else if (annexure) {
        body.annexure = true;
      } else {
        body.application = true;
      }
    }

    console.log(isBM)

    props
      .quickSign(
        formData,
        roleName,
        depart,
        username,
        flagNum,
        "",
        "",
        "",
        isRti,
        docId,
        body,
        correspondence || isBM === 0 ? true : false,
        correspondence,
        props.flag == "Noting"
      )

      .then((response) => {
        try {
          if (response.error) {
            let errMsg = handleError(response.error, true);
            if (errMsg?.flag) {
              handle504();
              setIsLoading(false);
              return;
            }
            callMessageOut(response.error);
            setIsLoading(false);
            return;
          }
          if (response !== undefined && response !== null) {
            setBlnDisable(false);

            if (response.url) {
              setFileURL(response.url);
              {
                props.flag == "Enclouser"
                  ? props.handleEnclosure(response.enclosure)
                  : isRti
                    ? props.loadRtiData()
                    : correspondence
                      ? props.handleCorr(response.file)
                      : props.callBackURL(response.file);
              }
              action.resetForm();
              props.isSignedCompleted(true);
              props.flag == "Noting" && props.setpdfLoads(true);
              props.flag == "Noting " && props.setNotingSigned(true);
            }
            dispatch(
              setSnackbar(
                true,
                "success",
                t("sign_successful,_please-wait_till_PDF_renders.")
              )
            );
            setIsLoading(false);
          } else {
            props.isSignedCompleted(false);
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
            setIsLoading(false);
          }
        } catch (e) {
          setIsLoading(false);
          props.isSignedCompleted(false);
          callMessageOut(e.message);
        }
      });
  };

  const submit2 = async (data, action) => {
    setIsLoading(true);
    // console.log(data.sendTo)
    const roles = data.sendTo.map((item, i) => item.deptRole[0]?.roleName);
    props
      .addYlowNote(
        data.comments,
        data.pencilColorCode,
        cabinetPcId,
        data.user,
        roles
      )
      .then((res) => {
        try {
          if (res.error) {
            setIsLoading(false);
            callMessageOut2("error", res.error);
            return;
          }
          callMessageOut2("success", "Yellow Note Added Successfully");
          action.resetForm();
          setIsLoading(false);
          props.addedSuccess(res);
        } catch (error) {
          setIsLoading(false);
          callMessageOut2("error", error.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut("error", err.message);
      });
  };

  const callMessageOut2 = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  const callMessageOut = (message) => {
    setIsLoading(false);
    props.isSignedCompleted(true);
    dispatch(setSnackbar(true, "error", message));
  };

  const values1 = {
    comments: "",
    pencilColorCode: personal?.personalize?.penColor || t("blue"),
    personalAppliactionFileId: props.fileId,
  }; //tag: "", signTitle: "",username: "", dep_desc: "", color: "",

  const values2 = {
    comments: "",
    pencilColorCode: sessionStorage.getItem("penColor") || personal?.personalize?.penColor || t("blue"),
    eyesOnly: false,
    sendTo: [],
    partcaseId: sessionStorage.getItem("partcaseID"),
    user: sessionStorage.getItem("role"),
  };

  const handle504 = () => {
    dispatch(
      setGateway(
        true,
        "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!",
        "inbox-sign",
        "/eoffice/inbox/file"
      )
    );
    setTimeout(() => {
      dispatch(setGateway(false, "", "inbox-sign", ""));
    }, 30000);
  };

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <Formik
        initialValues={isYloNote ? values2 : values1}
        validationSchema={isYloNote ? validationSchema2 : validationSchema1}
        onSubmit={isYloNote ? submit2 : submit1}
      >
        {(props) => (
          <Form {...props} blnDisable={blnDisable} isYloNote={isYloNote} />
        )}
      </Formik>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign, addYlowNote })(InputForm);
