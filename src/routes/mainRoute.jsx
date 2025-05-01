import React from "react";
import { Navigate, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const mainRoute = () => {
  return (
    <>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      <Route path="/landing-page" element={<MainLayout />} />
    </>
  );
};

export default mainRoute;
