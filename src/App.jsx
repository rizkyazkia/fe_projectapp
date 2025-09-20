import { Routes } from "react-router-dom";
import mainRoute from "./routes/mainRoute";
import dashboardRoute from "./routes/dashboardRoute/indexRoute";
import authRoute from "./routes/authRoute";
import { useAuth } from "./hooks/auth/useAuth";

function App() {
  return (
    <Routes>
      {mainRoute()}
      {dashboardRoute()}
      {authRoute()}
    </Routes>
  );
}

export default App;
