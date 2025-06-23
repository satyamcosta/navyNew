import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createContext } from "react";

export const DirContext = createContext();

export const DirProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramDirectory = searchParams.get("directory");

  const [dirFilter, setdirFilter] = useState(paramDirectory || "");

  const syncStateWithURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const paramDirectory = searchParams.get("directory");

    if (paramDirectory !== dirFilter) {
      setdirFilter(paramDirectory || "");
    }
  };
  useEffect(() => {
    syncStateWithURL();
  }, []);

  const handleFilter = (val) => {
    setdirFilter(val);
    const searchParams = new URLSearchParams();
    searchParams.set("page", 1);
    searchParams.set("pageSize", 25);
    searchParams.set("directory", val);

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

    // dispatch(setCabinetDirectory(val));
  };

  const resetFilter = () => {
    setdirFilter("");
  };
  return (
    <DirContext.Provider
      value={{
        dirFilter,
        handleFilter,
        resetFilter,
      }}
    >
      {children}
    </DirContext.Provider>
  );
};
