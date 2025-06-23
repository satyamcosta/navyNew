import React from "react";
import Cabinet from "./Cabinet";
import { DirProvider } from "./DirectoryProvider";
import { AdvanceProvider } from "../advanceSeach/AdvanceContext";

const Index = () => {
  return (
    <>
      <DirProvider>
        <AdvanceProvider>
          <Cabinet />
        </AdvanceProvider>
      </DirProvider>
    </>
  );
};

export default Index;
