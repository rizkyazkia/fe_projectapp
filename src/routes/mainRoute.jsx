import { Navigate, Route } from "react-router-dom";
import LandingPage from "../pages/main/LandingPage";

const mainRoute = () => {
  return (
    <>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      <Route path="/landing-page" element={<LandingPage/>} />
    </>
  );
};

export default mainRoute;
