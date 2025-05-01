import React from "react";
import adminRoute from "./adminRoute";
import schoolRoute from "./schoolRoute";

const indexRoute = () => {
  return (
    <>
      {adminRoute()}
      {schoolRoute()}
    </>
  );
};

export default indexRoute;
