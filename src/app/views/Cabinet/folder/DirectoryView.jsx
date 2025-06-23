import { TreeItem, TreeView } from "@material-ui/lab";
import React, { useContext, useEffect } from "react";
import { getSubSection } from "app/camunda_redux/redux/action";
import { Typography, makeStyles } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { FaFolderOpen } from "react-icons/fa";
import { useState } from "react";
import SubSection from "./SubSection";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { DirContext } from "./DirectoryProvider";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    height: 200,
    // flexGrow: 1,
    // maxWidth: 400,
  },
});

const DirectoryView = (props) => {
  const { t } = useTranslation();
  const { resetCabinetStates } = props;
  const { handleFilter, dirFilter } = useContext(DirContext);
  const dispatch = useDispatch();

  let department = "";
  let dept;
  if (sessionStorage.getItem("parent-dir")) {
    dept = sessionStorage.getItem("parent-dir")?.split("-")
  }
  else {
    dept = sessionStorage.getItem("department")?.split("-")
  }

  if (dept) {
    if (dept.length > 1) {
      department = dept[dept.length - 1];
    } else {
      department = dept[0];
    }
  }

  const classes = useStyles();

  const [SubSecList, setSubSecList] = useState([]);
  const [expanded, setExpanded] = useState([department]);
  const [selected, setSelected] = useState(dirFilter);

  const handleToggle = (event, nodeIds) => {
    console.log(nodeIds);
    if (nodeIds == department) {
      handleFilter("all");
      resetCabinetStates();
    }
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    if (selected == nodeIds) {
      setSelected("");
    } else {
      setSelected(nodeIds);
    }
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    const dept = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department")
    props.getSubSection(dept).then((res) => {
      try {
        if (res.error) {
          callMessageOut(res.error);
          return;
        } else {
          setSubSecList(res.response);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  }, []);

  return (
    <>
      <TreeView
        id="dir-tree"
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        <TreeItem
          nodeId={department}
          label={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",

              }}
            >
              <FaFolderOpen
                style={{
                  color: props.theme ? "#fff" : "#29638d",
                }}
              />
              <Typography variant="subtitle1" style={{
                fontWeight: 'bolder'
              }}>{department?.toUpperCase()}</Typography>
            </div>
          }
        >
          <TreeItem
            nodeId={t("archive")}
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",

                }}
              >
                <FaFolderOpen
                  style={{
                    color: props.theme ? "#fff" : "#29638d",
                  }}
                />
                <Typography variant="subtitle1" style={{
                  fontWeight: 'bolder'
                }}>{t("archive")}</Typography>
              </div>
            }
          >
            <TreeItem
              nodeId={`${department}-archive`}
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",

                  }}
                >
                  <FaFolderOpen
                    style={{
                      color: props.theme ? "#fff" : "#29638d",
                    }}
                  />
                  <Typography variant="subtitle1" style={{
                    fontWeight: 'bolder'
                  }}>{`${department}-archive`.toUpperCase()}</Typography>
                </div>
              }
              onClick={() => handleFilter(`${department}-archive`)}
            />
          </TreeItem>

          {SubSecList.map((item, i) => {
            return (
              <SubSection
                subSection={item}
                key={i}
                nodeId={item}
                resetCabinetStates={resetCabinetStates}
              />
            );
          })}
        </TreeItem>
      </TreeView>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    myInfo: state.myInfo,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getSubSection,
})(DirectoryView);
