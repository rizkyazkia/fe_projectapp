import React from "react";
import { Navigate, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

const authRoute = () => {
  return (
    <>
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
      </Route>
    </>
  );
};

export default authRoute;
