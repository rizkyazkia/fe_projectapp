import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/school/index";
import TeacherPage from "../../pages/dashboard/school/teachers";
import ClassesPage from "../../pages/dashboard/school/Classes";
import Question from "../../pages/dashboard/school/Question";
import Students from "../../pages/dashboard/school/Students";
import ProtectedRoute from "../guardsRoute/ProtectedRoute";
import { useAuth } from "../../hooks/auth/useAuth";

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
        <Route path="management-teachers" element={<TeacherPage />} />
        <Route path="management-classes" element={<ClassesPage />} />
        <Route path="management-students" element={<Students />} />
        <Route path="quesioner" element={<Question />} />
      </Route>
    </>
  );
};

export default schoolRoute;
