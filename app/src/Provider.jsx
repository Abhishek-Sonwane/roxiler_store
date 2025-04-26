import React from "react";
import { ContextProvider } from "./context";
import { BrowserRouter } from "react-router-dom";

const Provider = ({ children }) => {
  return (
    <div className="bg-purple-300">
      <ContextProvider>
        {" "}
        <BrowserRouter>{children}</BrowserRouter>
      </ContextProvider>
    </div>
  );
};

export default Provider;
