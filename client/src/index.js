import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { ToastContainer } from "react-toastify";
import reportWebVitals from "./reportWebVitals";
import AppRoutes from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ToastContainer
      position="bottom-center"
      theme="colored"
      pauseOnHover
      closeOnClick
    />
    <AppRoutes />
  </Router>
);
reportWebVitals();
