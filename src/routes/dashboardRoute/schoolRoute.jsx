import React from "react";
import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/school/index";
import QuesionerPage from "../../pages/dashboard/school/quesioner";
import TeacherPage from "../../pages/dashboard/school/teachers";
import ProtectedRoute from "../guardsRoute/protectedRoute";

const schoolRoute = () => {
  return (
    <>
      <Route
        path="/school"
        element={<Navigate to="/school/dashboard" replace />}
      />
      <Route
        path="/school"
        element={
          <ProtectedRoute allowedRoles={["school", "teacher"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="quesioner" element={<QuesionerPage />} />
        <Route path="management-teachers" element={<TeacherPage />} />
      </Route>
    </>
  );
};

export default schoolRoute;
