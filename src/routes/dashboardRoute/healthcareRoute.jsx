import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "../guardsRoute/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/healthcare/Index";
import Recommendation from "../../pages/dashboard/healthcare/Recommendation";
import FollowUp from "../../pages/dashboard/healthcare/FollowUp";
import History from "../../pages/dashboard/healthcare/History";
import StaffManagement from "../../pages/dashboard/healthcare/StaffManagement";

const healthcareRoute = () => {
  return (
    <>
      <Route
        path="/healthcare"
        element={<Navigate to="/healthcare/dashboard" replace />}
      />
      <Route
        path="/healthcare"
        element={
          <ProtectedRoute allowedRoles={["healthcare", "staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="list-of-recommendations" element={<Recommendation />} />
        <Route path="follow-up" element={<FollowUp />} />
        <Route path="treatment-history" element={<History />} />
        <Route path="staff-management" element={<StaffManagement />} />
      </Route>
    </>
  );
};

export default healthcareRoute;
