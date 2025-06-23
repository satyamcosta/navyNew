import React from "react";
import { useState } from "react";

export const SplitViewContext = React.createContext();

const SplitViewProvider = ({ children }) => {
  const [tabIndex, settabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState("one");
  const [route, setRoute] = useState([]);

  const [pendingRoute, setPendingRoute] = useState([])
  const [completedRoute, setCompletedRoute] = useState([])

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleRoute = (route) => {
    setRoute(route);
  };

  return (
    <SplitViewContext.Provider
      value={{
        tabIndex,
        loading,
        alignment,
        settabIndex,
        setLoading,
        handleAlignment,
        route,
        handleRoute,
        pendingRoute,
        setPendingRoute,
        completedRoute,
        setCompletedRoute
      }}
    >
      {children}
    </SplitViewContext.Provider>
  );
};

export default SplitViewProvider;
