import { createContext, useState, useContext, useEffect } from "react";

const AlertContext = createContext();

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertCounts, setAlertCounts] = useState(() => {
    const storedAlertCounts = localStorage.getItem("alertCounts");
    return storedAlertCounts ? JSON.parse(storedAlertCounts) : { alert: 0, alarm: 0, normal: 0, finish: 0, notCounted: 0 };
  });

  useEffect(() => {
    localStorage.setItem("alertCounts", JSON.stringify(alertCounts));
  }, [alertCounts]);

  return (
    <AlertContext.Provider value={{ alertCounts, setAlertCounts }}>
      {children}
    </AlertContext.Provider>
  );
};
