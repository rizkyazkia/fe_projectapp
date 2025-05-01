import React from "react";
import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/admin/Index";
import ProtectedRoute from "../guardsRoute/protectedRoute";
import Institution from "../../pages/dashboard/admin/Institution";
import Users from "../../pages/dashboard/admin/Users";
import Category from "../../pages/dashboard/admin/Category";
import Question from "../../pages/dashboard/admin/Question";

const adminRoute = () => {
  return (
    <>
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="category" element={<Category />} />
        <Route path="question" element={<Question />} />
        <Route path="management-users" element={<Users />} />
        <Route path="institution" element={<Institution />} />
      </Route>
    </>
  );
};

export default adminRoute;
