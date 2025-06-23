import React, { useEffect, useState, createElement, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  URLHide,
  saveAnnotation,
  getAnnotation,
  currentSign,
} from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Dialog, DialogTitle, Typography } from "@material-ui/core";
import CustomLinkDialog from "../CustomLinkDialog";
import { useTranslation } from "react-i18next";
import Loading from "app/pdfViewer/Loading";
import Cookies from "js-cookie";

const SplitViewPdfViewer = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const viewer = useRef(null);
  const documentLoadRef = useRef({
    docLoad: "",
    finishRender: "",
    pageUpdate: "",
  });

  const {
    flag,
    extension,
    anottId,
    fileUrl,
    signed,
    editable,
    fileId,
    flagNumber,
    pageNumber,
    toggleState,
    action,
    pdfLoading
  } = props;
  const [instance, setInstance] = useState(null);
  const darkMode = props.theme;
  const [openHyerLinkDialog, setopenHyerLinkDialog] = useState(false);
  const { currentSign } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);

  // To refresh document on webviewer
  const [refresh, setRefresh] = useState(false)

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const handleWaterMark = (docViewer) => {
    docViewer.setWatermark({
      // Draw diagonal watermark in middle of the document
      // diagonal: {
      //   fontSize: 35, // or even smaller size
      //   fontFamily: "sans-serif",
      //   color: "#5a5ad6",
      //   opacity: 40, // from 0 to 100
      //   text: `${sessionStorage.getItem("pklDirectrate")}`,
      // },

      // Draw header watermark
      // header: {
      //   fontSize: 10,
      //   fontFamily: "sans-serif",
      //   color: "red",
      //   opacity: 70,
      // },

      // Custom WaterMark
      custom: (ctx, pageNumber, pageWidth, pageHeight) => {
        const watermarkText = `${localStorage
          .getItem("username")
          .toUpperCase()}`;
        const watermarkFontSize = 15;
        const watermarkSpacing = 5; // Spacing between watermarks
        const watermarkOpacity = 0.07; // Opacity of the watermarks

        // Set watermark properties
        ctx.fillStyle = `rgba(90, 90, 214, ${watermarkOpacity})`;
        ctx.font = `${watermarkFontSize}pt sans-serif`;

        // Calculate the width and height of the watermark text
        const watermarkWidth = ctx.measureText(watermarkText).width;
        const watermarkHeight = watermarkFontSize;

        // Calculate the number of watermarks that can fit horizontally and vertically
        const numWatermarksHorizontally = Math.floor(
          pageWidth / (watermarkWidth + watermarkSpacing)
        );
        const numWatermarksVertically = Math.floor(
          pageHeight / (watermarkHeight + watermarkSpacing)
        );

        // Calculate the actual spacing between watermarks based on the available space
        const spacingHorizontal =
          (pageWidth - numWatermarksHorizontally * watermarkWidth) /
          (numWatermarksHorizontally + 1);
        const spacingVertical =
          (pageHeight - numWatermarksVertically * watermarkHeight) /
          (numWatermarksVertically + 1);

        // Set the initial x and y coordinates for the first watermark
        let x = spacingHorizontal;
        let y = spacingVertical;

        // Draw the watermarks horizontally and vertically
        for (let i = 0; i < numWatermarksVertically; i++) {
          for (let j = 0; j < numWatermarksHorizontally; j++) {
            ctx.fillText(watermarkText, x + 20, y);
            x += watermarkWidth + spacingHorizontal + watermarkSpacing;
          }
          x = spacingHorizontal; // Reset x-coordinate for the next row
          y += watermarkHeight + spacingVertical + watermarkSpacing;
        }
      },
    });
  };

  const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    instance.UI.setHeaderItems((header) => {
      header.pop();
    });
    instance.UI.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
        title: "Full Screen",
        onClick: () => {
          handleFullScreen();
        },
      });
    });
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResize);
  };

  const handleFullScreen = () => {
    if (viewer.current.requestFullscreen) {
      viewer.current.requestFullscreen();
    } else if (viewer.current.mozRequestFullScreen) {
      /* Firefox */
      viewer.current.mozRequestFullScreen();
    } else if (viewer.current.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      viewer.current.webkitRequestFullscreen();
    } else if (viewer.current.msRequestFullscreen) {
      /* IE/Edge */
      viewer.current.msRequestFullscreen();
    }

    instance.UI.setHeaderItems((header) => {
      header.pop();
    });
    instance.UI.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-exit-svgrepo-com.svg`,
        title: "Exit Full Screen",
        onClick: () => {
          handleExitFullScreen();
        },
      });
    });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
  };

  // full screen handler
  const handleResize = () => {
    if (
      document.webkitIsFullScreen ||
      document.mozFullscreen ||
      document.mozFullScreenElement
    ) {
      instance.UI.setHeaderItems((header) => {
        header.pop();
      });
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-exit-svgrepo-com.svg`,
          title: "Exit Full Screen",
          onClick: () => {
            handleExitFullScreen();
          },
        });
      });
    } else {
      instance.UI.setHeaderItems((header) => {
        header.pop();
      });
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
          title: "Full Screen",
          onClick: () => {
            handleFullScreen();
          },
        });
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "F11") {
      if (fullScreen == false) {
        window.removeEventListener("resize", handleResize);
        instance.UI.setHeaderItems((header) => {
          header.pop();
        });
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
            title: "Full Screen",
            onClick: () => {
              handleFullScreen();
            },
          });
        });
      }
      setTimeout(() => {
        window.addEventListener("resize", handleResize);
      }, 1000);
    }
  };

  useEffect(async () => {
    try {
      if (instance !== null) {
        let flag1 = true;
        let newSign = currentSign;

        if (!fileUrl) {
          return;
        } else {
          instance.UI.setHeaderItems((header) => {
            header.pop();
            header.pop();
            editable && header.pop();
          });
          // handleWaterMark(documentViewer);
          console.log({
            extension,
          });
          setLoading(true);
          const URL =
            fileUrl === "" || fileUrl == "def"
              ? `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`
              : fileUrl;
          let data;

          if (fileUrl == "def") {
            setLoading(false);
            instance.UI.loadDocument(URL, {
              extension: "pdf",
            });
            return;
          }

          if (action) {
            data = fileUrl;
          } else if (fileUrl != "def") {
            let response = await props.URLHide(URL);

            data = await response.blob();
          }
          setLoading(false);
          let fileName = extension ? `test.${extension}` : "test.docx";
          let file = new File([data], fileName);

          instance.UI.loadDocument(file, {
            extension: extension ? extension : "docx",
            onError: (err) => {
              console.log(err);
              instance.UI.loadDocument(file, {
                extension: "pdf",
              });
            },
          });
          props?.pdfLoads(true);

          const { documentViewer, annotationManager, Actions, Annotations } =
            instance.Core;

          if (props.isCustomLink) {
            const onTriggered = Actions.URI.prototype.onTriggered;

            Actions.URI.prototype.onTriggered = function (target, event) {
              console.log("hyperlink redirect");
              if (target instanceof Annotations.Link) {
                const link = JSON.parse(target.actions.U[0].bB);
                let newObj = props.enclosureData.find(
                  (item) => Number(item.flagNumber) === Number(link.flagNumber)
                );
                console.log(link);
                props.handleChange1(newObj, link.pageNumber, link.id, true);
                return;
              }
              onTriggered.apply(this, arguments);
            };

            instance.UI.textPopup.update([
              {
                type: "actionButton",
                img: "icon-tool-link",
                onClick: (arg) => {
                  setopenHyerLinkDialog(true);
                },
              },
            ]);
          }

          documentViewer.addEventListener("pageNumberUpdated", (pageNumber) => {
            props.isPage && props.handleChangePage(pageNumber);
          });

          instance.UI.setHeaderItems((header) => {
            if (editable) {
              header.push({
                type: "actionButton",
                img: `${process.env.PUBLIC_URL}/assets/images/annotation.svg`,
                title: t("save_annot"),
                onClick: async () => {
                  setLoading(true);
                  annotationManager.exportAnnotations().then((res) => {
                    const body = { annotationData: res };
                    const val = JSON.stringify(body);
                    props
                      .saveAnnotation(val, fileId, flag, flagNumber)
                      .then(function (response) {
                        if (response.status === "OK") {
                          // props.setReloadInboxData();
                          flag1 = true;
                          dispatch(
                            setSnackbar(
                              true,
                              "success",
                              "Annotation saved successfully"
                            )
                          );
                          setLoading(false);
                          props.handleNofAnnoid(response.id);
                          let trigger = false;
                          // setTimeout(() => {
                          //   trigger = true;
                          //   props.changingTableStateInbox(
                          //     trigger,
                          //     "CHANGE_INBOX"
                          //   );
                          //   if (flag === "Initiate") {
                          //     props.changingTableStateAnnexure(
                          //       trigger,
                          //       "CHANGE_PA_ANNEXURE"
                          //     );
                          //   }
                          //   if (flag === "PA" || "Annexture") {
                          //     props.changingTableStateHrmConcern(
                          //       trigger,
                          //       "CHANGE_HRM"
                          //     );
                          //   }
                          // }, 2000);
                        } else {
                          dispatch(
                            setSnackbar(
                              true,
                              "error",
                              "Annotation saved Failure !"
                            )
                          );
                          setLoading(false);
                        }
                      });
                  });
                },
              });
            }

            header.push({
              type: "actionButton",
              img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
              title: "Full Screen",
              onClick: () => {
                handleFullScreen();
              },
            });

            header.push({
              type: "actionButton",
              img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/refresh.svg`,
              title: "Refresh",
              onClick: () => {
                console.log("Refresh")
                setRefresh(!refresh)
              },
            });

          });

          documentViewer.addEventListener("finishedRendering", function () {
            if (newSign) {
              documentViewer.setCurrentPage(
                parseInt(documentViewer.getPageCount())
              );
            }

            newSign = false;
            props.currentSign(false);

            const searchPattern =
              Cookies.get("searchNoting") || Cookies.get("searchText");
            const searchOptions = {
              caseSensitive: false,
              wholeWord: false,
              wildcard: true,
              regex: false,
              searchUp: false,
              ambientString: true,
            };

            //   // start search after document rendering is complete
            searchPattern &&
              instance.UI.searchText(searchPattern, searchOptions);
            Cookies.remove("searchNoting");
            Cookies.remove("searchText");

            if (flag1) {
              flag1 = false;
              if (anottId !== null && anottId !== undefined && anottId !== "") {
                loadxfdfStrings(anottId)
                  .then(function (rows) {
                    let xString = rows.xsdfString;
                    annotationManager
                      .importAnnotations(xString)
                      .then((response) => {
                        setLoading(false);
                        // response.forEach((col) => {
                        //   annotationManager
                        //     .importAnnotationCommand(col)
                        //     .then(function (annotations) {
                        //       annotationManager.drawAnnotationsFromList(
                        //         annotations
                        //       );
                        //     });
                        // });
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                  });
              }
            }
          });

          documentViewer.addEventListener("documentLoaded", function () {
            document.getElementById("pdfviewer_tron").offsetWidth > 900
              ? documentViewer.zoomTo(1.5)
              : instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
            props.isPage &&
              documentViewer.setCurrentPage(parseInt(pageNumber), true);
            instance.UI.setLayoutMode(instance.UI.LayoutMode.Continuous)
          });
        }
      } else {
        WebViewer(
          {
            licenseKey:
              "AngelBot AI LLP:OEM:AngelBot AI CRM::B+:AMS(20291022):0664A24CE67FB55A8048B253187CE30C600DE2660BDD878643CF028B9622DAB6F5C7",
            path: `${process.env.PUBLIC_URL + "/webviewer/lib"}`,
            initialDoc: `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`,
            fullAPI: true,
            enableRedaction: true,
            backendType: "ems",
            disableLogs: true,
            isAdminUser: true,
          },
          viewer.current
        )
          .then((instance) => {
            setInstance(instance);
            instance.UI.setLanguage("en");
            const { documentViewer, annotationManager } = instance.Core;
            instance.Core.disableEmbeddedJavaScript();
            const author = sessionStorage.getItem("role");
            handleWaterMark(documentViewer);
            annotationManager.setCurrentUser(author); // now each annotation owner is based on role of logged in user
            // Here allow editing in pdf only if in splitview

            // Actions.setCustomOnTriggeredHandler(
            //   Actions.URI,
            //   (target, event, documentViewer, options) => {
            //     console.log(target)
            //     if (target instanceof Annotations.Link) {
            //       return;
            //     }
            //     options.originalOnTriggered(target, event, documentViewer);
            //   }
            // );
            instance.UI.setToolbarGroup("toolbarGroup-View");

            // documentViewer.addEventListener("annotationsLoaded", () => {
            //   setLoading(false);
            //   console.log("we")
            //   // widgets and links will remain in the document without changing so it isn't necessary to export them
            //   annotationManager
            //     .exportAnnotations({ links: true, widgets: false })
            //     .then((xfdfString) => {
            //       console.log(xfdfString);
            //       // Full samples are available at the end of this section.
            //     });
            // });
            instance.UI.disableElements(["errorModal", "panToolButton",
              "freeHandToolGroupButton",
              "textToolGroupButton",
              "shapeToolGroupButton",
              "eraserToolButton",
              "signatureToolButton",
              "redactionButton",
              "freeTextToolButton",
              "stickyToolButton",
              "miscToolGroupButton",
              "toolsButton",
              "toolbarGroup-Shapes",
              "toolbarGroup-Edit",
              "toolbarGroup-Insert",
              "toolbarGroup-Forms",
              "toolbarGroup-Redact",
              "toolbarGroup-FillAndSign",
              "selectToolButton",
              "leftPanelButton",
              "notesPanel",
              "toggleNotesButton"]);

            if (!editable) {
              instance.UI.disableElements([
                "toolbarGroup-Annotate",
              ]);
            }

          })
          .catch((e) => { });
      }
    } catch (e) {
      console.log(e);
      callMessageOut(e.message);
    }
  }, [instance, fileUrl, signed, toggleState, action, refresh]);

  useEffect(() => {
    if (instance !== null) {
      if (darkMode) {
        instance.UI.setTheme("dark");
      } else instance.UI.setTheme("light");
    }
  }, [instance, darkMode]);

  const renderPdf = () => {
    // const prevPdf = <div className="webviewer" style={{ height: "100vh" }} ref={ViewerDiv}></div>
    const newPdf = createElement("div", {
      id: "pdfv" + Math.random(),
      className: "webviewer",
      style: { height: "100%" },
      ref: viewer,
    });
    return newPdf;
  };

  const addHyperLink = (url) => {
    setLoading(true);
    const { Actions, documentViewer, annotationManager } = instance.Core;

    const selectedTextQuads = documentViewer.getSelectedTextQuads();

    const currentPageLinks = [];
    const action = new Actions.URI({ uri: url });

    for (const pageNumber in selectedTextQuads) {
      selectedTextQuads[pageNumber].forEach((quad) => {
        const link = newLink(
          Math.min(quad.x1, quad.x3),
          Math.min(quad.y1, quad.y3),
          Math.abs(quad.x1 - quad.x3),
          Math.abs(quad.y1 - quad.y3),
          parseInt(pageNumber)
        );
        link.addAction("U", action);
        currentPageLinks.push(link);
      });
    }
    annotationManager.addAnnotations(currentPageLinks);
    let pageNumbersToDraw = currentPageLinks.map((link) => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach((pageNumberToDraw) => {
      annotationManager.drawAnnotations(pageNumberToDraw, null, true);
    });
    handleSave();
  };

  const newLink = (x, y, width, height, linkPageNumber) => {
    const { Annotations } = instance.Core;
    const link = new Annotations.Link();
    link.PageNumber = linkPageNumber;
    link.StrokeColor = new Annotations.Color(0, 165, 228);
    link.StrokeStyle = "underline";
    link.StrokeThickness = 2;
    link.Author = "Test user";
    link.Subject = "Link";
    link.X = x;
    link.Y = y;
    link.Width = width;
    link.Height = height;
    return link;
  };

  const handleSave = async () => {
    const { annotationManager } = instance.Core;

    annotationManager
      .exportAnnotations({ link: true })
      .then((resp) => {
        const body = { annotationData: resp };
        const val = JSON.stringify(body);
        props
          .saveAnnotation(val, fileId, flag, flagNumber)
          .then((resp) => {
            handleClose();
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message);
          });
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (props.getSfdt) {
      const { annotationManager } = instance.Core;

      annotationManager
        .exportAnnotations({ link: true })
        .then((resp) => {
          // const body = { annotationData: resp };
          // const val = JSON.stringify(body);
          props.handleSfdt(resp);
        })
        .catch((e) => { });
    }
  }, [props.getSfdt]);

  const handleClose = () => {
    setopenHyerLinkDialog(false);
  };

  var loadxfdfStrings = function (documentId) {
    setLoading(true);
    return props.getAnnotation(documentId);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(instance?.docViewer.getPageCount());
  //   }, 1000);
  // }, [fileUrl]);

  return (
    <>
      {props.isCustomLink && (
        <Dialog
          open={openHyerLinkDialog}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ minWidth: "600px" }}>
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
              onClose={handleClose}
            >
              <Typography>{t("insert_hyperlink")}</Typography>
            </DialogTitle>
            <CustomLinkDialog
              enclosureData={props.enclosureData}
              addHyperLink={addHyperLink}
              handleClose={handleClose}
            />
          </div>
        </Dialog>
      )}
      <div className="App" id="pdfviewer_tron">
        <>
          {renderPdf()}
          {(loading || pdfLoading) && <Loading />}
        </>
      </div>
      ;
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  URLHide,
  saveAnnotation,
  getAnnotation,
  currentSign,
})(React.memo(SplitViewPdfViewer));
