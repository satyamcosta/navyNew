import React from "react";
import SplitViewProvider from "./Worker";
import SplitViewer from "./SplitViewer";

const SplitView = (props) => {
  return (
    <SplitViewProvider>
      <SplitViewer />
    </SplitViewProvider>
  );
};

export default SplitView;
