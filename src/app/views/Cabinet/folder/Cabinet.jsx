import React, { useState, useEffect, createContext, useContext } from "react";
import { Grid } from "@material-ui/core";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import { getStatus } from "app/camunda_redux/redux/action/index";
import CabinetTableView from "./CabinetTableView";
import ExternalCabinet from "./ExternalCabinet";
import PermanentlyClose from "./PermanentlyClose";
import "./index.css";
import { clearCookie } from "utils";

import { Breadcrumb } from "matx";
import { Loading } from "../therme-source/material-ui/loading";
import { AdvanceSearchContext } from "../advanceSeach/AdvanceContext";
import { setExtCabinetConfig } from "app/redux/reducers/modulesTableConfig/modulesTablesConfigReducer";
import ca from "date-fns/locale/ca";
import { DirContext } from "./DirectoryProvider";

const CabinetView = (props) => {
  const dept = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");
  const { AdvanceReset, AdvanceOnChange } = useContext(AdvanceSearchContext);
  const { resetFilter, dirFilter } = useContext(DirContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { isHidden } = useSelector(
    (state) => state.moduleTableConfig.extCabinet
  );

  const [cab, setCab] = useState(!isHidden);
  const [closefile, setClosefile] = useState(isHidden);
  const [permanentClose, setpermanentClose] = useState(true);
  const [cabinet, setCabinet] = useState(isHidden);
  const [extCabinet, setextCabinet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState("");

  const [deptObj, setDeptObj] = useState(null);
  const [sectionObj, setsectionObj] = useState(null);

  const [isExt, setIsExt] = useState(false);

  const handleExternal = (val) => {
    setIsExt(val);
  };

  useEffect(() => {
    if (dept) {
      let deptArr = dept.split("-");
      setDeptObj({
        name: deptArr?.length > 1 ? deptArr[deptArr.length - 1] : deptArr[0],
        path: "/eoffice/cabinet/file",
      });
    }
    if (dirFilter) {
      setsectionObj(
        dirFilter != "all"
          ? { name: dirFilter, path: "/eoffice/cabinet/file" }
          : null
      );
    }
  }, [dept, dirFilter]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);
  }, []);

  const handleLoading = (val) => {
    setLoading(val);
  };
  useEffect(() => {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    sessionStorage.removeItem("route");
    clearCookie();
  }, []);

  const resetSearchParamsUrl = () => {
    resetFilter();
    const searchParams = new URLSearchParams();

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

    // dispatch(setCabinetDirectory(val));
  };
  const handleShow = () => {
    dispatch(setExtCabinetConfig({ isHidden: true }));
    resetSearchParamsUrl();
    setCab(false);
    setCabinet(true);
    setClosefile(true);
    setpermanentClose(true);
    setScope("internal");
    AdvanceReset(true);
    // AdvanceOnChange("scope", "internal");
  };

  const handleclose = () => {
    dispatch(setExtCabinetConfig({ isHidden: false }));
    resetSearchParamsUrl();
    setClosefile(false);
    setCab(true);
    setCabinet(false);
    setpermanentClose(true);
    setextCabinet(true);
    setScope("external");
    AdvanceReset(true);
    // AdvanceOnChange("scope", "external");
  };
  const { t } = props;

  return (
    <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
      {loading && <Loading />}
      <Grid container className="cabinate_container" spacing={2}>
        <Grid item xs={12}>
          <Breadcrumb routeSegments={[deptObj, sectionObj]} />
        </Grid>
        <Grid
          style={{
            marginTop: "-22px",
          }}
          item
          xs={12}
        >
          {/* <Grid item>
              {cabinet ? (
                <CabinetTableView handleLoading={handleLoading} />
              ) : extCabinet ? (
                <ExternalCabinet handleLoading={handleLoading} />
              ) : (
                <PermanentlyClose handleLoading={handleLoading} />
              )}
            </Grid> */}
          <div
            style={{
              display: "flex",
              alignItems: "end"
            }}
          >
            <div
              className={`mrt-head ${isExt ? "un-active" : ""}`}
              onClick={() => handleExternal(false)}
            >
              <span>{t("int")}</span>
            </div>
            <div
              className={`mrt-head ${isExt ? "" : "un-active"}`}
              onClick={() => handleExternal(true)}
            >
              <span>{t("ext")}</span>
            </div>
          </div>

          <Grid
            item
            style={{
              width: "calc(100vw - 87px)",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "10px",
            }}
          >
            {!isExt ? (
              <CabinetTableView handleLoading={handleLoading} />
            ) : (
              <ExternalCabinet handleLoading={handleLoading} />
            )}
          </Grid>

          {/*
            <Grid item>
            <ul
              style={{
                // position: "fixed",
                right: "16px",
                padding: 0,
              }}
            >
              {cab ? (
                <li className="hide" onClick={() => handleShow()}>
                  {t("int")}
                </li>
              ) : (
                <li
                  className="hide1"
                  style={{ userSelect: "none", cursor: "default" }}
                >
                  {t("int")}
                </li>
              )}

              {closefile ? (
                <li className="hide" onClick={() => handleclose()}>
                  {t("ext")}
                </li>
              ) : (
                <li
                  className="hide1"
                  onClick={() => handleclose()}
                  style={{ userSelect: "none", cursor: "default" }}
                >
                  {t("ext")}
                </li>
              )}
              
            </ul>
          </Grid>
            */}
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});
export default withRouter(
  connect(mapStateToProps, { getStatus })(withTranslation()(CabinetView))
);
