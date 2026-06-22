// Setup React Router

import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "../pages/Dashboard";

import { ExamsPage } from "../features/exams/pages/ExamsPage";
import AppLayout from "../pages/AppLayout";
import { AddExamPage } from "../features/exams/pages/AddExamPage";
import { EditExamPage } from "../features/exams/pages/EditExamPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { PublicRoute } from "../routes/PublicRoute";

import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import CaloriesPage from "../features/calories/CaloriesPage";
import WelcomePage from "../pages/WelcomePage";
import NotFoundPage from "../pages/NotFoundPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage key="login-page" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/new" element={<AddExamPage />} />
            <Route path="/exams/:id/edit" element={<EditExamPage />} />
            <Route path="/calories" element={<CaloriesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
