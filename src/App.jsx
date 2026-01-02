import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import OrdersPage from './pages/orders/OrdersPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppHeader, Sidebar } from './components/layout/Layout';
import './styles/index.css';
import SignUpPage from './pages/auth/RegisterPage';

const PrivateLayout = () => {
  const { token } = useAuth();
  const [active, setActive] = useState('dashboard');

  if (!token) return <Navigate to="/login" replace />;

  let Page = DashboardPage;
  if (active === 'products') Page = ProductsPage;
  if (active === 'orders') Page = OrdersPage;

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Sidebar active={active} onChange={setActive} />
        <section className="app-content">
          <Page />
        </section>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { token } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/" replace /> : <SignUpPage />}
      />
      <Route path="/*" element={<PrivateLayout />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
