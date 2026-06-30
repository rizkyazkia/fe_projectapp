import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/admin/Index";
import Institution from "../../pages/dashboard/admin/Institution";
import Users from "../../pages/dashboard/admin/Users";
import Category from "../../pages/dashboard/admin/Category";
import Question from "../../pages/dashboard/admin/Question";
import BalancedNutritionKnowledgeLevel from "../../pages/dashboard/admin/Questions/BalancedNutritionKnowledgeLevel";
import ChildrensDailyHabits from "../../pages/dashboard/admin/Questions/ChildrensDailyHabits";
import HealthServiceofSchool from "../../pages/dashboard/admin/Questions/HealthServiceofSchool";
import ProtectedRoute from "../guardsRoute/ProtectedRoute";

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
            path="kebiasaan-sehari-hari-anak"
            element={<ChildrensDailyHabits />}
          />
          <Route
            path="pelayanan-kesehatan-sekolah"
            element={<HealthServiceofSchool />}
          />
        </Route>
        <Route path="management-users" element={<Users />} />
        <Route path="institution" element={<Institution />} />
      </Route>
    </>
  );
};

export default adminRoute;
