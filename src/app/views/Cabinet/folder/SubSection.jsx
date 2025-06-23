import { TreeItem } from "@material-ui/lab";
import React, { useContext } from "react";
import { getSubSecList } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { Typography } from "@material-ui/core";
import { DirContext } from "./DirectoryProvider";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const SubSection = ({ subSection, nodeId, resetCabinetStates, ...props }) => {
  const dispatch = useDispatch();
  let department = sessionStorage.getItem("department");
  const { dirFilter, handleFilter } = useContext(DirContext);

  const [fileList, setFileList] = useState([]);
  const [count, setCount] = useState(5);
  const [expand, setexpand] = useState(false);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const getFileList = () => {
    if (dirFilter === subSection) {
      // props.getSubSecList(department, subSection, count).then((res) => {
      //   try {
      //     if (res.error) {
      //       callMessageOut(res.error);
      //       return;
      //     } else {
      //       setFileList(res.response?.data);
      //     }
      //   } catch (e) {
      //     callMessageOut(e.message);
      //   }
      // });
      handleFilter("all");
    } else {
      handleFilter(subSection);
    }
    resetCabinetStates();

    // setexpand(!expand);
  };

  return (
    <>
      <TreeItem
        nodeId={nodeId}
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
            <Typography variant="subtitle1">{subSection?.toUpperCase()}</Typography>
          </div>
        }
        onClick={getFileList}
      />
      {/*
      <TreeItem
        nodeId={nodeId}
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
                color: "rgb(20, 70, 107)",
              }}
            />
            <Typography variant="subtitle1">{subSection}</Typography>
          </div>
        }
        onClick={getFileList}
      >
        {fileList.length ? (
          fileList.map((item, i) => {
            return (
              <TreeItem
                nodeId={item}
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
                        color: "rgb(20, 70, 107)",
                      }}
                    />
                    <Typography variant="subtitle2">{item}</Typography>
                  </div>
                }
              />
            );
          })
        ) : (
          <TreeItem
            nodeId={nodeId + "hi"}
            label={
              <Typography variant="subtitle2">NOTHING TO SHOW HERE</Typography>
            }
          />
        )}
      </TreeItem>
      */}
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
  getSubSecList,
})(SubSection);
