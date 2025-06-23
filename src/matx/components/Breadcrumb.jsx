// import React, { Fragment, useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
// import HomeIcon from "@material-ui/icons/Home";
// import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// const Breadcrumb = ({ routeSegments, otherData }) => {
//   const { t } = useTranslation();
//   const { theme } = useSelector((state) => state);
//   const [width, setWidth] = useState(window.innerWidth);
//   const { showPa } = useSelector((state) => state.appRoutes);

//   useEffect(() => {
//     const handleResize = () => {
//       setWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="flex flex-middle position-relative app-breadCrumb">
//       <NavLink
//         to={`${
//           showPa ? "/eoffice/dashboard/analytics" : "/eoffice/inbox/file"
//         }`}
//       >
//         <HomeIcon
//           style={{
//             color: theme ? "rgb(119, 135, 153)" : "rgb(53, 76, 100)",
//             fontSize: "1rem",
//           }}
//         />
//       </NavLink>

//       <div
//         style={{ marginBottom: "6px", display: "flex", alignItems: "center" }}
//       >
//         {routeSegments
//           ? routeSegments.map((route, index) => (
//               <Fragment key={index}>
//                 <ArrowForwardIosIcon
//                   style={{
//                     fontSize: "0.8rem",
//                     color: theme ? "#fff" : "#1b1a1a",
//                   }}
//                 />
//                 {index !== routeSegments.length - 1 ? (
//                   <NavLink to={route.path}>
//                     <span
//                       style={{
//                         fontSize: "0.75rem",
//                         color: theme
//                           ? "rgb(119, 135, 153)"
//                           : "rgb(53, 76, 100)",
//                         fontWeight: "bold",
//                       }}
//                       className="capitalize"
//                     >
//                       {route.name}
//                     </span>
//                   </NavLink>
//                 ) : (
//                   <span
//                     style={{ fontSize: "0.75rem", marginBottom: "-2px" }}
//                     className="capitalize"
//                   >
//                     {route.name}
//                   </span>
//                 )}
//               </Fragment>
//             ))
//           : null}
//         {otherData &&
//           otherData.map((data, index) => {
//             if (data.value != "UNDEFINED") {
//               return (
//                 <Fragment key={index}>
//                   {index !== otherData.length - 1 ? (
//                     <span
//                       style={{
//                         fontSize: "12px",
//                         display: width < 750 ? "none" : "block",
//                       }}
//                       className="capitalize"
//                     >
//                       &nbsp;|{" "}
//                       <span style={{ fontWeight: "800" }}>{data.key} - </span>
//                       {data.value}
//                     </span>
//                   ) : (
//                     <span
//                       style={{
//                         fontSize: "12px",
//                         display: width < 750 ? "none" : "block",
//                       }}
//                       className="capitalize"
//                     >
//                       &nbsp;|{" "}
//                       <span style={{ fontWeight: "800" }}>{data.key} - </span>
//                       {data.value}
//                     </span>
//                   )}
//                 </Fragment>
//               );
//             }
//           })}
//       </div>
//     </div>
//   );
// };

// export default Breadcrumb;

import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "@material-ui/icons/Home";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tooltip } from "@material-ui/core";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const Breadcrumb = ({ routeSegments, otherData, routeData, flowRoute }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const [width, setWidth] = useState(window.innerWidth);
  const { showPa } = useSelector((state) => state.appRoutes);

  console.log(flowRoute);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to copy the full subject to clipboard
  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          dispatch(setSnackbar(true, "success", t("copy_sub")));
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    } else {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          dispatch(setSnackbar(true, "success", t("copy_sub")));
        } else {
          alert("Could not copy text to clipboard.");
        }
      } catch (err) {
        console.error("Fallback: Could not copy text: ", err);
      }
    }
  };

  return (
    <div className="flex flex-middle position-relative app-breadCrumb">
      {/*
        <NavLink
        to={`${showPa ? "/eoffice/dashboard/app" : "/eoffice/dashboard/app"}`}
      >
        <HomeIcon
          style={{
            color: theme ? "rgb(119, 135, 153)" : "rgb(53, 76, 100)",
            fontSize: "1rem",
          }}
        />
      </NavLink>
        */}

      <div
        style={{ marginBottom: "6px", display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        {routeSegments
          ? routeSegments.map(
            (route, index) =>
              route && (
                <Fragment key={index}>
                  {index != 0 && (
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "0.8rem",
                        color: theme ? "#fff" : "#1b1a1a",
                      }}
                    />
                  )}
                  {index !== routeSegments.length - 1 ? (
                    <NavLink to={route.path}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: theme
                            ? "rgb(184 177 255)"
                            : "rgb(26, 13, 171)",
                          fontWeight: "bold",
                        }}
                        className="capitalize"
                      >
                        {route.name?.toUpperCase()}
                      </span>
                    </NavLink>
                  ) : (
                    <span
                      style={{ fontSize: "0.8rem", marginBottom: "-2px", fontWeight: "bold" }}
                      className="capitalize"
                    >
                      {route.name?.toUpperCase()}
                    </span>
                  )}
                </Fragment>
              )
          )
          : null}
        {otherData &&
          otherData.map((data, index) => {
            if (data.value != "UNDEFINED") {
              let isSubject = data.key == t("subject");
              return (
                <Fragment key={index}>
                  {index !== otherData.length - 1 ? (
                    <Tooltip
                      title={data.value}
                      onClick={() => isSubject && copyToClipboard(data.value)}
                    >
                      <span
                        style={{
                          fontSize: "1rem",
                          display: width < 750 ? "none" : "block",
                          cursor: isSubject ? "copy" : "initial",
                        }}
                        className="capitalize breadcrumb_text"
                      >
                        &nbsp;|{" "}
                        <span style={{ fontWeight: "800" }}>{data.key} - </span>
                        {data.value}
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={data.value}
                      onClick={() => copyToClipboard(data.value)}
                    >
                      <span
                        style={{
                          fontSize: "1rem",
                          display: width < 750 ? "none" : "block",
                        }}
                        className="capitalize breadcrumb_text"
                      >
                        &nbsp;|{" "}
                        <span
                          className="breadcrumb_text"
                          style={{ fontWeight: "800" }}
                        >
                          {data.key} -{" "}
                        </span>
                        {data.value}
                      </span>
                    </Tooltip>
                  )}
                </Fragment>
              );
            }
          })}
        {
          flowRoute?.length > 0 && (
            <span
              style={{
                fontSize: "1rem",
                display: width < 750 ? "none" : "block",
              }}
              className="capitalize breadcrumb_text"
            >
              &nbsp;|{" "}
              <span className="breadcrumb_text" style={{ fontWeight: "800" }}>
                {t("route")} -{" "}
              </span>
              {flowRoute?.map((data, index) => {
                let path = data?.replace("DIR-", "")
                return (
                  <span
                    key={index}
                    style={{
                      color:
                        path?.includes("-glow") ? "#FFA41C" : "initial",
                    }}
                  >
                    {path?.replace("-glow", "")}
                    {
                      index != flowRoute?.length-1 ? "->" : ""
                    }
                  </span>
                );
              })}
            </span>
          )
        }
        {routeData?.length > 0 && (
          <Tooltip title={routeData.join("")}>
            <span
              style={{
                fontSize: "1rem",
                display: width < 750 ? "none" : "block",
              }}
              className="capitalize breadcrumb_text"
            >
              &nbsp;|{" "}
              <span className="breadcrumb_text" style={{ fontWeight: "800" }}>
                {t("route")} -{" "}
              </span>
              {routeData?.map((data, index) => {
                return (
                  <span
                    key={index}
                    style={{
                      color:
                        routeData?.length - 1 == index ? "#FFA41C" : "initial",
                    }}
                  >
                    {data}
                  </span>
                );
              })}
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
