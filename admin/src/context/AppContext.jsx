import { createContext } from "react";
export const AppContext = createContext(null);
const AppContextProvider = ({ children }) => {
  const currency = "₹";
  const calculateAge = (DOB) => {
    const today = new Date();
    const birthday = new Date(DOB);
    let age = today.getFullYear() - birthday.getFullYear();
    return age;
  };
  const value = { calculateAge, currency };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
