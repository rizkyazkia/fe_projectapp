import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext.jsx";

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <ToastContainer
        autoClose={1500}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <App />
    </AuthProvider>
  </Router>
);
