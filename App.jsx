import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import Members from "./pages/Members.jsx";
import Events from "./pages/Events.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";
import LogoutConfirm from "./pages/LogoutConfirm.jsx";
import LogoutThanks from "./pages/LogoutThanks.jsx";

export default function App() {
  return (
    <Routes>
      {/* Shell with header/sidebar/footer */}
      <Route path="/" element={<Layout />}>
        {/* default */}
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="members" element={<Members />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="logout" element={<LogoutConfirm />} />
        <Route path="goodbye" element={<LogoutThanks />} />
      </Route>

      {/* helpful redirect if someone types singular */}
      <Route path="/application" element={<Navigate to="/applications" replace />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
