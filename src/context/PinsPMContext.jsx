import { createContext, useState, useContext, useEffect } from "react";

const PinsPerMonth = createContext();

export function usePinsPerMonth() {
  const context = useContext(PinsPerMonth);
  if (context === undefined) {
    throw new Error("usePinsPerMonth must be used within a PinsPMProvider");
  }
  return context;
}

export const PinsPMProvider = ({ children }) => {
  const [pinsPM, setPinsPM] = useState(() => {
    const storedPinsPM = localStorage.getItem("pinsPM");
    return storedPinsPM ? JSON.parse(storedPinsPM) : [];
  });

  useEffect(() => {
    localStorage.setItem("pinsPM", JSON.stringify(pinsPM));
  }, [pinsPM]);

  return (
    <PinsPerMonth.Provider value={{ pinsPM, setPinsPM }}>
      {children}
    </PinsPerMonth.Provider>
  );
};
