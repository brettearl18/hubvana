import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Coach pages
import CoachDashboard from './pages/coach/Dashboard';
import ClientManagement from './pages/coach/ClientManagement';
import Templates from './pages/coach/Templates';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import CheckIn from './pages/client/CheckIn';
import Progress from './pages/client/Progress';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={userProfile.role === 'coach' ? '/coach' : '/client'} />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Coach routes */}
      <Route path="/coach" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout>
            <CoachDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/coach/clients" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout>
            <ClientManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/coach/templates" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout>
            <Templates />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Client routes */}
      <Route path="/client" element={
        <ProtectedRoute allowedRoles={['client']}>
          <Layout>
            <ClientDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/check-in" element={
        <ProtectedRoute allowedRoles={['client']}>
          <Layout>
            <CheckIn />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/progress" element={
        <ProtectedRoute allowedRoles={['client']}>
          <Layout>
            <Progress />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes; 