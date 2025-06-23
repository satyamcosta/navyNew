import React from "react";
import { useContext } from "react";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";
import YlowNotes from "../../YlowNotes";
import { SplitViewContext } from "../Worker";
import ViewOne from "./ViewOne";
import ViewTwo from "./ViewTwo";
import { BmContext } from "./Worker";
import MobileView from "./MobileView";
import { isTablet } from "utils";
import { useEffect } from "react";
import { useState } from "react";
import InternalCommentFile from "../../InternalCommentFile";
import { connect } from "react-redux";

const BmContainer = (props) => {
  const { alignment } = useContext(SplitViewContext);

  const [mobile, setmobile] = useState(isTablet());

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = (e) => {
    if (isTablet()) {
      setmobile(true);
    } else {
      setmobile(false);
    }
  };

  return (
    <>
      {/* {mobile ? (
        <div className="mobile_view">
          <MobileView />
        </div>
      ) : (
        <div className="web_view">
          {alignment === "one" ? <ViewOne /> : <ViewOne />}
        </div>
      )} */}

      <div
        className="web_view"
        style={{
          padding: "0rem 1rem",
          border: "1px solid #80808085",
          background: props.theme ? "initial" : "#ffffffa1",
          display:"flex",
          gap:"4px"
        }}
      >
        {alignment === "one" ? <ViewOne /> : <ViewOne />}
      </div>

      <Remarks />

      <YlowNotes />

      <CloseFile />

      <InternalCommentFile />
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    props: state.props,
  };
};

export default connect(mapStateToProps, null)(BmContainer);

