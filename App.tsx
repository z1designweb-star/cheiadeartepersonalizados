
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Department from './pages/Department.tsx';
import Product from './pages/Product.tsx';
import AdminLogin from './pages/Admin/Login.tsx';
import AdminDashboard from './pages/Admin/Dashboard.tsx';
import ProductForm from './pages/Admin/ProductForm.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departamento/:id" element={<Department />} />
            <Route path="/produto/:id" element={<Product />} />
            
            {/* Rotas Administrativas */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/produtos/novo" element={<ProductForm />} />
            <Route path="/admin/produtos/editar/:id" element={<ProductForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
