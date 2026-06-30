import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Buffer } from 'buffer';
import { Calendar } from "vanilla-calendar-pro";
import _ from "lodash";

globalThis.Buffer = Buffer;
window.VanillaCalendarPro = Calendar;
window._ = _;

import("preline").then(() => {
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
});
