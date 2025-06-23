import { useState } from "react";
import { createContext } from "react";

export const AdvanceSearchContext = createContext();

const initialValues = {
  text: "",
  sendBy: "",
  createdBy: "",
  fileNo: "",
  subject: "",
  status: "",
  CreatedOn: "",
  scope: "internal",
  filters: "",
};
export const AdvanceProvider = ({ children }) => {
  const [advanceState, setAdvanceState] = useState(initialValues);

  const AdvanceOnChange = (name, value) => {
    setAdvanceState({ ...advanceState, [name]: value });
  };

  const AdvanceReset = (all) => {
    if (all) {
      setAdvanceState(initialValues);
    } else {
      setAdvanceState({
        ...advanceState,
        sendBy: "",
        createdBy: "",
        fileNo: "",
        subject: "",
        status: "",
        CreatedOn: "",
        scope: "internal",
        filters: "",
      });
    }
  };

  return (
    <AdvanceSearchContext.Provider
      value={{ ...advanceState, AdvanceOnChange, AdvanceReset }}
    >
      {children}
    </AdvanceSearchContext.Provider>
  );
};
