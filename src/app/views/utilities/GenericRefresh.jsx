import { IconButton, Tooltip } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import React from "react";
import { useTranslation } from "react-i18next";

const GenericRefresh = ({ handleRefresh }) => {
  const { t } = useTranslation();
  return (
    <>
      <IconButton
        id="RTI_sort_btn"
        aria-haspopup="true"
        onClick={handleRefresh}
        disableRipple
      >
        <Tooltip title={t("refresh")}>
          <SyncIcon />
        </Tooltip>
      </IconButton>
    </>
  );
};

export default GenericRefresh;
