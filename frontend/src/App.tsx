import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage'; import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard'; import PatientDashboard from './pages/PatientDashboard'; import DoctorDashboard from './pages/DoctorDashboard';

const queryClient = new QueryClient();

// RBAC Route Protection
const ProtectedRoute = ({ children, role }: any) => {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/auth" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
};

const RootRedirect = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth" />;
  return <Navigate to={`/${user.role}`} />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/patient" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
