import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/auth/login";

  return (
    <div className="grid grid-cols-2">
      <div id="left" className="h-screen w-full overflow-hidden">
        <img
          src="/auth-bg.png"
          alt="auth-bg"
          className="h-full w-full object-center"
        />
      </div>
      <div
        id="right"
        className={`flex items-center justify-center ${
          !isLoginPage ? "-order-1" : ""
        }`}
      >
        <div className="bg-white border border-obito-grey min-w-md h-fit p-5 rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
