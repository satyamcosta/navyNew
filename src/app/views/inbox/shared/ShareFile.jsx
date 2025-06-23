import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Cancel, Done } from "@material-ui/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Autocomplete } from "@material-ui/lab";

const ShareFile = ({ open, type, handleClose, ...props }) => {
  let referenceNumber = Cookies.get("referenceNumber");
  let subject = Cookies.get("inboxFile");

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const [externalList, setExternalList] = useState([]);
  const [desigList, setDesigList] = useState([]);

  const [directorate, setDirectorate] = useState("");
  const [roles, setRoles] = useState([]);

  const [isExt, setIsExt] = useState(false);
  const [isDesig, setIsDesig] = useState(false);

  const handleDirectorate = (val) => {};

  const handleDesign = (val) => {};

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="draggable-dialog-title"
        id="cabinet-create-file"
      >
        {loading && <Loading />}
        <DialogTitle
          // style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{`${type ? t("share_file") : t("share_dak")}`}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="create_file_dialog_close_button"
              aria-label="close"
              onClick={() => {
                // formik.handleReset();
                handleClose();
              }}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent dividers>
            <Typography
              style={{
                textAlign: "center",
                opacity: ".7",
                marginBottom: "20px",
              }}
            >
              {`${type ? t("share_file_desc") : t("share_dak_desc")}`}
            </Typography>

            <Box
              sx={{ width: "100%", marginTop: "5px" }}
              className="cabinate_container"
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    // forcePopupIcon={true}
                    options={externalList}
                    getOptionLabel={(option) => option}
                    id="tags-outlined"
                    value={directorate}
                    onChange={(event, newValue) => {
                      handleDirectorate(newValue);
                    }}
                    // onInputChange={(event, newInputValue) => {
                    //   !newInputValue.includes("|") &&
                    //     optimizedInternalService(newInputValue);
                    // }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_directorate")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder={t("enter_directorate")}
                        className={props.theme ? "darkTextField" : ""}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isExt ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    multiple
                    // forcePopupIcon={true}
                    options={desigList}
                    getOptionLabel={(option) => option}
                    id="tags-outlined"
                    value={roles}
                    onChange={(event, newValue) => {
                      handleDesign(newValue);
                    }}
                    // onInputChange={(event, newInputValue) => {
                    //   !newInputValue.includes("|") &&
                    //     optimizedInternalService(newInputValue);
                    // }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_desig")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder={t("entern_desig")}
                        className={props.theme ? "darkTextField" : ""}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isExt ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="medium"
                    label={t("comment")}
                    placeholder="ENTER YOUR COMMENT"
                    multiline
                    minRows={1}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ maxLength: 250 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              endIcon={<Done />}
              color="secondary"
              variant="contained"
              type="submit"
              disabled={!comment?.trim()}
            >
              {t("ok")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, null)(ShareFile);
