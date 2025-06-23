import { Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { memo, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {useTranslation} from "react-i18next"

const useStyles = makeStyles((theme) => ({
  selectBox: {
    "& .MuiOutlinedInput-inputMarginDense": {
      paddingTop: "5px",
      paddingBottom: "5px",
    },
  },
}));

const PaginationComp = (props) => {

  const {t} = useTranslation()

  const {
    pageSize,
    currentPage,
    setCurrentPage,
    pageSizes,
    totalCount,
    setPageSize,
    isIndexWay,
  } = props;
  const classes = useStyles();
  const [pageNumber, setPageNumber] = useState(0);
  const [PageSize2, setPageSize2] = useState(pageSize);

  const handleChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleChange2 = (event, value) => {
    setCurrentPage(PageSize2 * (value - 1));
    setPageSize(PageSize2 * (value - 1 + 1));
  };

  const handleChangePage = (e) => {
    setPageSize2(e.target.value);
    setPageSize(e.target.value);
    setCurrentPage(0);
  };

  useEffect(() => {
    let val = Math.ceil(totalCount / pageSize);
    setPageNumber(val);
  }, [totalCount, pageSize]);

  return (
    <Grid
      style={{
        padding: "5px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        flexGrow: 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <Pagination
          count={pageNumber}
          page={currentPage + 1}
          onChange={(e, v) => {
            if (isIndexWay) handleChange2(e, v);
            else handleChange(e, v);
          }}
        />
        <TextField
          select
          value={isIndexWay ? PageSize2 : pageSize}
          onChange={handleChangePage}
          variant="outlined"
          size="small"
          className={`${classes.selectBox} app-select-dark`}
        >
          {pageSizes?.concat(25, 50, 100)?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Typography style={{ marginLeft: ".8rem" }}>{t("pag_item")}</Typography>
      </div>
      <div>
        <Typography>
          {currentPage + 1} of {pageNumber} {t("pages")} ({totalCount} {t("files")})
        </Typography>
      </div>
    </Grid>
  );
};

export default memo(PaginationComp);
