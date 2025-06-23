import React, { useState, useEffect, useRef } from "react";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import {
  Box,
  Button,
  Paper,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  Switch,
  Tooltip,
  Divider,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setTableColumns } from "app/redux/actions/PersonalizeInfo";

const GenericColHider = (props) => {
  const { tableCols, setTableCols, moduleName } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  const [isShowDisabled, setIsShowDisabled] = useState(false);
  const [isHideDisabled, setIsHideDisabled] = useState(false);

  const tableColsRef = useRef(tableCols);

  const handleCloseMenu = (event) => {
    setOpenMenu(false);
  };

  // Update the ref whenever tableCols state changes
  useEffect(() => {
    tableColsRef.current = tableCols;
  }, [tableCols]);

  const handleChange = (key) => {
    let updatedCol = {
      ...tableCols,
      [key]: !tableCols[key],
    };

    setTableCols(updatedCol);
  };

  useEffect(() => {
    if (tableCols) {
      const allVisible = Object.values(tableCols).every((item) => item);
      const allHidden = Object.values(tableCols).every((item) => !item);
      setIsShowDisabled(allVisible);
      setIsHideDisabled(allHidden);
    }
  }, [tableCols]);

  const handleHideAll = () => {
    const updatedCols = Object.keys(tableCols).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    setTableCols(updatedCols);
  };

  const handleShowAll = () => {
    const updatedCols = Object.keys(tableCols).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTableCols(updatedCols);
  };

  useEffect(() => {
    return () => {
      dispatch(setTableColumns(moduleName, tableColsRef.current));
    };
  }, [dispatch, moduleName, tableColsRef.current]);
  return (
    <div>
      <Tooltip title={t("show_hide_col")}>
        <IconButton onClick={() => setOpenMenu(!openMenu)} ref={menuRef}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Popper
        open={openMenu}
        anchorEl={menuRef.current}
        transition
        disablePortal
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper
              variant="elevation"
              elevation={20}
              style={{
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList
                  autoFocusItem={openMenu}
                  id="topbar-menu-list-grow"
                  style={{ zIndex: "1" }}
                >
                  <MenuItem button={false}>
                    <Box
                      style={{ width: "100%" }}
                      className="flex flex-space-around"
                    >
                      <Button
                        variant="text"
                        disabled={isHideDisabled}
                        onClick={handleHideAll}
                      >
                        {t("hide_all")}
                      </Button>
                      <Button
                        variant="text"
                        disabled={isShowDisabled}
                        onClick={handleShowAll}
                      >
                        {t("show_all")}
                      </Button>
                    </Box>
                  </MenuItem>
                  <Divider />
                  {tableCols &&
                    Object.keys(tableCols).map((key) => (
                      <MenuItem key={key}>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Tooltip title="Toggle Visibility" arrow>
                                <Switch
                                  checked={tableCols[key]}
                                  onChange={() => handleChange(key)}
                                  name="checkedB"
                                  color="primary"
                                />
                              </Tooltip>
                            }
                            label={t(key).toUpperCase()}
                          />
                        </FormGroup>
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default GenericColHider;
