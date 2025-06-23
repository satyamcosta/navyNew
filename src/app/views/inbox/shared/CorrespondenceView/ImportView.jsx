import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import { Grid } from "@material-ui/core";
import {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
  loadIndexData,
} from "../../../../camunda_redux/redux/action";
import { connect, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Breadcrumb } from "matx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import SplitViewPdfViewer from "../../shared/pdfViewer/pdfViewer";
import "../../../Personnel/therme-source/material-ui/loading.css";
import {
  PaneDirective,
  PanesDirective,
  SplitterComponent,
} from "@syncfusion/ej2-react-layouts";
import TreeTable from "../../../Personnel/TreeTable";
import { Loading } from "../../../Personnel/therme-source/material-ui/loading";
import { setSnackbar } from "../../../../../app/camunda_redux/redux/ducks/snackbar";
import { handleError } from "utils";
import CorrContainer from "../../shared/CorrespondenceView/CorrContainer";
import history from "../../../../../history";

const FileViewTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);

  const pFileName = Cookies.get("paFileId");
  const referenceNumber = Cookies.get("paFileName");
  const isCorr = Cookies.get("isCorr") == "true";
  const upload = Cookies.get("import") == "true";

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pafileURL, setPaFileURL] = useState("");
  const [annexurefileURL, setAnnexureFileURL] = useState("");
  const [extension, setExtension] = useState("docx");
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedRow, setselectedRow] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    if (!upload) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (!upload) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [upload]);

  const loadFileView = () => {
    // setLoading(true);
    if (isCorr) {
      fetch("/correspondence_service/api/v2/getIndexCorrDoc", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          sessionId: sessionStorage.getItem("sessionId"),
          userName: localStorage.getItem("username"),
          roleName: sessionStorage.getItem("role"),
          pageSize,
          fileId: pFileName,
          pageNumber: currentPage,
          department: sessionStorage.getItem("department"),
          address: sessionStorage.getItem("ipAddress"),
        },
        body: JSON.stringify({
          fromDate: "",
          toDate: "",
          type: "",
          subject: "",
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          try {
            if (response.error) {
              callMessageOut(response.error);
              setLoading(false);
            } else {
              let tmpArr = [];
              tmpArr = response?.content?.map((item, index) => {
                return {
                  ...item,
                  id: item.id,
                  serialNo: pageSize * currentPage + (index + 1),
                  subject: item.subject,
                  classification: item.classification,
                };
              });
              setTotalCount(tmpArr.length);
              setRowData(tmpArr);

              if (tmpArr.length === 0) {
                setPaFileURL("");
              } else {
                setPaFileURL(tmpArr[0].fileURL);
                setSelectedRowId(tmpArr[0].id);
                setselectedRow(tmpArr[0]);
              }
              setLoading(false);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          setLoading(false);
        });
      // props
      //   .loadIndexData(pFileName, pageSize, currentPage, {
      //     fromDate: "",
      //     toDate: "",
      //     type: "",
      //     subject: "",
      //   })
      //   .then(({ response }) => {
      //     try {
      //       if (response.error) {
      //         callMessageOut(response.error);
      //         setLoading(false);
      //       } else {
      //         let tmpArr = [];
      //         tmpArr = response?.content?.map((item, index) => {
      //           return {
      //             ...item,
      //             id: item.id,
      //             serialNo: pageSize * currentPage + (index + 1),
      //             subject: item.subject,
      //             classification: item.classification,
      //           };
      //         });
      //         setTotalCount(tmpArr.length);
      //         setRowData(tmpArr);

      //         if (tmpArr.length === 0) {
      //           setPaFileURL("");
      //         } else {
      //           setPaFileURL(tmpArr[0].fileURL);
      //           setSelectedRowId(tmpArr[0].id);
      //           setselectedRow(tmpArr[0]);
      //         }
      //         setLoading(false);
      //       }
      //     } catch (error) {
      //       callMessageOut(error.message);
      //       setLoading(false);
      //     }
      //   })
      //   .catch((e) => {
      //     //   console.log(e);
      //     //   let errMsg = handleError(e.message);
      //     //   callMessageOut(errMsg);
      //     //   setLoading(false);
      //   });
    } else {
      props
        .getPersonalApplicationFileData(pFileName, pageSize, currentPage)
        .then(({ response }) => {
          //   try {
          //     if (response.error) {
          //       callMessageOut(response.error);
          //       setLoading(false);
          //     } else {
          //       let tmpArr = [];
          //       tmpArr = response.data.map((item, index) => {
          //         return {
          //           ...item,
          //           serialNo: pageSize * currentPage + (index + 1),
          //         };
          //       });
          //       setTotalCount(tmpArr.length);
          //       setRowData(tmpArr);
          //       if (tmpArr.length === 0) {
          //         setPaFileURL("");
          //       } else {
          //         setPaFileURL(tmpArr[0].fileURL);
          //         setSelectedRowId(tmpArr[0].id);
          //       }
          //       setLoading(false);
          //     }
          //   } catch (error) {
          //     callMessageOut(error.message);
          //     setLoading(false);
          //   }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadFileView();
  }, [currentPage, pageSize, isCorr, pFileName]);

  return <div>hello</div>;
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
  loadIndexData,
})(FileViewTable);
