import { Routes } from "react-router-dom";

import React from "react";

import mainRoute from "./routes/mainRoute";
import dashboardRoute from "./routes/dashboardRoute/indexRoute";
import authRoute from "./routes/authRoute";

function App() {
  return (
    <Routes>
      {mainRoute()}
      {dashboardRoute()}
      {authRoute()}
    </Routes>
  );
}

export default App;
