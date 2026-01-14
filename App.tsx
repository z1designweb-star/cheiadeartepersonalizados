
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Department from './pages/Department';
import Product from './pages/Product';

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
