import React from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { Outlet, useLocation } from "react-router-dom";
import Mobile from "../components/dashboard/Mobile";

const DashboardLayout = () => {
  const location = useLocation();

  const isDashboard = location.pathname.endsWith("/dashboard");

  return (
    <>
      <Header />
      <Mobile />
      <Sidebar />
      {/* Content */}
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div
            className={`${
              isDashboard
                ? "bg-none border-0 shadow-none rounded-none p-0"
                : "bg-white border border-obito-grey shadow-sm rounded-lg p-10"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
      {/* End Content */}
    </>
  );
};

export default DashboardLayout;
