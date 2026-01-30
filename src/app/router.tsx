// Setup React Router

import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "../pages/Dashboard";

import { ExamsPage } from "../features/exams/pages/ExamsPage";
import AppLayout from "../pages/AppLayout";
import { AddExamPage } from "../features/exams/pages/AddExamPage";
import { EditExamPage } from "../features/exams/pages/EditExamPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage key="login-page" />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/new" element={<AddExamPage />} />
            <Route path="/exams/:id/edit" element={<EditExamPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
