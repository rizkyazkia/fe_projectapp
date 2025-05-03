import React from "react";
import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/admin/Index";
import ProtectedRoute from "../guardsRoute/protectedRoute";
import Institution from "../../pages/dashboard/admin/Institution";
import Users from "../../pages/dashboard/admin/Users";
import Category from "../../pages/dashboard/admin/Category";
import Question from "../../pages/dashboard/admin/Question";
import BalancedNutritionKnowledgeLevel from "../../pages/dashboard/admin/Questions/BalancedNutritionKnowledgeLevel";
import ImplementationofHealthEducation from "../../pages/dashboard/admin/Questions/ImplementationofHealthEducation";
import ChildrensDailyHabits from "../../pages/dashboard/admin/Questions/ChildrensDailyHabits";
import ImplementationofHealthServices from "../../pages/dashboard/admin/Questions/ImplementationofHealthServices";
import HealthyEnvironmentDevelopment from "../../pages/dashboard/admin/Questions/HealthyEnvironmentDevelopment";

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
        <Route
          path="question"
          element={
            <Navigate
              to="/admin/question/tingkat-pengetahuan-gizi-seimbang"
              replace
            />
          }
        />
        <Route path="question" element={<Question />}>
          <Route
            path="tingkat-pengetahuan-gizi-seimbang"
            element={<BalancedNutritionKnowledgeLevel />}
          />
          <Route
            path="pelaksanaan-pendidikan-kesehatan"
            element={<ImplementationofHealthEducation />}
          />
          <Route
            path="kebiasaan-sehari-hari-anak"
            element={<ChildrensDailyHabits />}
          />
          <Route
            path="pelaksanaan-pelayanan-kesehatan"
            element={<ImplementationofHealthServices />}
          />
          <Route
            path="pembinaan-lingkungan-sehat"
            element={<HealthyEnvironmentDevelopment />}
          />
        </Route>
        <Route path="management-users" element={<Users />} />
        <Route path="institution" element={<Institution />} />
      </Route>
    </>
  );
};

export default adminRoute;
