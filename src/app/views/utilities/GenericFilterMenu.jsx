import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@material-ui/core";
import { Done, FilterList } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
  },
  menuStyling: {
    display: "grid",
    gridTemplateColumns: "1rem 1fr",
    gap: ".6rem",
  },
  doneIcon: {
    fontSize: ".8rem",
    opacity: ".8",
  },
  displayNone: {
    fontSize: ".8rem",
    opacity: "0",
  },
}));

const GenericFilterMenu = (props) => {

  const {t} = useTranslation()
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [sortObj, setSortObj] = useState({
    title: "",
    type: "Asc",
  });

  const anchorRef = useRef(null);

  // useEffect(() => {
  //   if (sortObj.title !== "" && sortObj.type !== "") {
  //     props.addSort(sortObj);
  //   }
  // }, [sortObj]);

  useEffect(() => {
    if (!_.isEmpty(props.sort)) setSortObj(props.sort);
  }, [props?.sort]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  let strOrder = [
    { label: "A to Z", value: "Asc" },
    { label: "Z to A", value: "Desc" },
  ];
  let dateOrder = [
    { label: "Oldest on top", value: "Asc" },
    { label: "Newest on top", value: "Desc" },
  ];

  const handleChangeSortBy = (e, value) => {
    let newObj = { ...sortObj, title: value };
    setSortObj(newObj);
    props.addSort(newObj);
    handleClose(e);
  };

  const handleChangeSortOrder = (e, value) => {
    let newObj = { ...sortObj, type: value };
    setSortObj(newObj);
    props.addSort(newObj);
    handleClose(e);
  };

  const handleSortType = (arr) =>
    arr.map((item) => (
      <MenuItem
        className={classes.menuStyling}
        key={item.label}
        onClick={(e) => handleChangeSortOrder(e, item.value)}
      >
        <Done
          className={
            sortObj.type !== item.value ? classes.displayNone : classes.doneIcon
          }
        />
        {item.label}
      </MenuItem>
    ));

  return (
    <div className={classes.root}>
      <IconButton
        id="RTI_sort_btn"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        disableRipple
      >
        <Tooltip title={t("sort_by")}>
          <FilterList />
        </Tooltip>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{
          zIndex: "3",
          boxShadow: "2px 2px 10px 4px #dddddd4d",
          width: "150px",
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem disabled key="sortBy">
                    Sort By
                  </MenuItem>
                  {props.SortValueTypes?.map((item, i) => (
                    <MenuItem
                      key={item.label}
                      onClick={(e) => handleChangeSortBy(e, item)}
                      className={classes.menuStyling}
                    >
                      <Done
                        className={
                          sortObj.title?.name !== item.name
                            ? classes.displayNone
                            : classes.doneIcon
                        }
                      />
                      {item.label}
                    </MenuItem>
                  ))}
                  <div style={{ borderTop: "1px solid #ddd" }}>
                    <MenuItem disabled key="sortOrder">
                      Sort Order
                    </MenuItem>
                    {sortObj.title?.type === "date"
                      ? handleSortType(dateOrder)
                      : handleSortType(strOrder)}
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default GenericFilterMenu;
