import { Navigate, Route } from "react-router-dom";
import LandingPage from "../pages/main/LandingPage";
import GamePage from "../pages/game/gamepage";

const mainRoute = () => {
  return (
    <>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />

      <Route
        path="/landing-page"
        element={<LandingPage />}
      />

      <Route
        path="/game"
        element={<GamePage />}
      />
    </>
  );
};

export default mainRoute;
