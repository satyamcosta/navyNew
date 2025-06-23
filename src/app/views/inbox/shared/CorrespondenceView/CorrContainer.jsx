import React from "react";
import CorrProvider from "./Worker";
import Viewer from "./Viewer";
const CorrContainer = ({ corrObj, readOnly }) => {
  return (
    <>
      <CorrProvider corrObj={corrObj}>
        <Viewer readOnly={readOnly} />
      </CorrProvider>
    </>
  );
};

export default CorrContainer;
