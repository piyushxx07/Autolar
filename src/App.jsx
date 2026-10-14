import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import EnergyHistory from './pages/EnergyHistory';
import DeviceControl from './pages/DeviceControl';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import Marketing from './pages/Marketing';
import AuthPage from './pages/AuthPage';
import Assistant from './pages/Assistant';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import './styles/main.scss'; // Already imported in main.jsx, but we can also import here if needed

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-loading">Loading your workspace…</div>;
  return user ? <div className="app"><Header /><div className="app-content"><Sidebar /><main className="app-main"><Outlet /></main></div><Footer /><MobileNav /></div> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
    <DeviceProvider>
      <BrowserRouter>
              <PwaInstallPrompt />
              <Routes>
                <Route path="/" element={<Marketing />} />
                <Route path="/about" element={<Marketing page="about" />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage signup />} />
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/energy-history" element={<EnergyHistory />} />
                  <Route path="/device-control" element={<DeviceControl />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
      </BrowserRouter>
    </DeviceProvider>
    </AuthProvider>
  );
}

export default App;
