import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DeptInfo = (props) => {

  const {t} = useTranslation()

  return (
    <div className="dept-info-con">
      <div className="dept-info-row">
        <span>{t("dept_name")}</span>
        <span>{props?.deptObj?.deptName}</span>
      </div>
      <div className="dept-info-row">
        <span>{t("principal_usr")}</span>
        <span>{props?.deptObj?.coordRole}</span>
      </div>
      <div className="dept-info-row">
        <span>{t("usr_id")}</span>
        <span>{props?.deptObj?.userId}</span>
      </div>
      <div className="dept-info-row">
        <span>{t("mr_user")}</span>
        <span>{props?.deptObj?.mailRole}</span>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, null)(DeptInfo);
