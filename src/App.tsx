import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AdminEditor } from "./pages/AdminEditor";
import { AdminLogin } from "./pages/AdminLogin";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminEditor />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
