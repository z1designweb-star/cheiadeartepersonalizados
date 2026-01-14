
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Department from './pages/Department.tsx';
import Product from './pages/Product.tsx';

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
