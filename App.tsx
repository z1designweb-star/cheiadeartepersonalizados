
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Department from './pages/Department.tsx';
import Product from './pages/Product.tsx';
import CheckoutResult from './pages/CheckoutResult.tsx'; // Importando o novo componente unificado
import AdminLogin from './pages/Admin/Login.tsx';
import AdminDashboard from './pages/Admin/Dashboard.tsx';
import ProductForm from './pages/Admin/ProductForm.tsx';
import { CartProvider } from './context/CartContext.tsx';
import CartSidebar from './components/CartSidebar.tsx';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <CartSidebar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/departamento/:id" element={<Department />} />
              <Route path="/produto/:id" element={<Product />} />
              
              {/* Rotas de Finalização Unificadas */}
              <Route path="/sucesso" element={<CheckoutResult />} />
              <Route path="/erro" element={<CheckoutResult />} />
              <Route path="/pendente" element={<CheckoutResult />} />

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
    </CartProvider>
  );
};

export default App;
