import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Router from "./app/router";
import { ToastProvider } from "./context/ToastContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
    <Provider store={store}>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </Provider>
  </GoogleOAuthProvider>,
  // </React.StrictMode>,
);
