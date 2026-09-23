import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import DisplayShell from "./pages/display/DisplayShell";
import DisplayHome from "./pages/display/DisplayHome";
import SequencePage from "./pages/display/SequencePage";
import CardOrientationScanner from "./components/CardOrientationScanner";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/degree" element={<CardOrientationScanner />} />

      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <Scan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/display"
        element={
          <ProtectedRoute>
            <DisplayShell />
          </ProtectedRoute>
        }
      >
        {/* Initial display screen */}
        <Route index element={<DisplayHome />} />

        {/* Scanned sequence */}
        <Route path=":seq" element={<SequencePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
