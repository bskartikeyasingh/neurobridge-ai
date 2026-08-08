import { Routes, Route, Navigate } from "react-router-dom";
import StudentProfile from "./pages/StudentProfile";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Communication from "./pages/Communication";
import Screening from "./pages/Screening";
import Reports from "./pages/Reports";
import Students from "./pages/Students";
import Learn from "./pages/Learn";
import Copilot from "./pages/Copilot";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <RoleRoute roles={["teacher", "admin"]}>
            <Students />
          </RoleRoute>
        }
      />
      <Route
  path="/communication"
  element={
    <ProtectedRoute>
      <Communication />
    </ProtectedRoute>
  }
/>
      <Route
        path="/communication/:id"
        element={
          <ProtectedRoute>
            <Communication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/screening/:id"
        element={
          <RoleRoute roles={["teacher", "admin"]}>
            <Screening />
          </RoleRoute>
        }
      />

      {/* Added: Route for imported Reports component */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Added: Route for imported Copilot component */}
      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
            <Copilot />
          </ProtectedRoute>
        }
      />

      {/* Fixed: Renamed from "/learning" to "/learn" */}
      <Route
        path="/learn"
        element={
          <RoleRoute roles={["student"]}>
            <Learn />
          </RoleRoute>
        }
      />

      {/* Catch-all Route (Fixed: Removed duplicate) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;