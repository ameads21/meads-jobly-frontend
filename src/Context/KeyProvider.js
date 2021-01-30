import React from "react";
import KeyContext from "./KeyContext";
import useLocalStorageState from "../hooks/useLocalStorageState";
import JoblyApi from "../Api";

const RegisterProvider = ({ children }) => {
  const [key, setKey] = useLocalStorageState("authorization", null);
  const savingKey = (token) => {
    setKey(token);
    JoblyApi.token = key;
  };

  return (
    <KeyContext.Provider value={{ key, savingKey }}>
      {children}
    </KeyContext.Provider>
  );
};
export default RegisterProvider;
