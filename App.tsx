
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Department from './pages/Department.tsx';
import Product from './pages/Product.tsx';
import Success from './pages/Success.tsx'; // Importando a nova página
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
              
              {/* Rotas de Finalização */}
              <Route path="/sucesso" element={<Success />} />
              <Route path="/erro" element={<div className="p-20 text-center font-serif text-3xl text-red-500">Houve um problema no pagamento.</div>} />
              <Route path="/pendente" element={<div className="p-20 text-center font-serif text-3xl text-yellow-500">Seu pagamento está em análise.</div>} />

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
