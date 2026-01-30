import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Router from "./app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
);
