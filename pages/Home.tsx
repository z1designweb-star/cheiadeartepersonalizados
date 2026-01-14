
import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, FEATURED_PRODUCTS } from '../constants.tsx';
import ProductCard from '../components/ProductCard.tsx';

const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=1920" 
            alt="Fundo Aromático" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Cheia de Arte: <br/><span className="text-[#f4d3d2]">Aromas que Curam</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubra a harmonia em cada detalhe. Nossos produtos aromáticos são criados manualmente para despertar sentimentos e transformar sua rotina.
            </p>
            <Link 
              to="/departamento/velas-aromaticas"
              className="inline-block px-8 py-4 bg-[#f4d3d2] text-white rounded-full font-medium text-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Explorar Coleção
            </Link>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Nossos Departamentos</h2>
          <div className="w-20 h-1 bg-[#f4d3d2] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {DEPARTMENTS.map((dept) => (
            <Link 
              key={dept.id} 
              to={`/departamento/${dept.id}`}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-md mb-4 group-hover:border-[#f4d3d2] transition-colors">
                <img 
                  src={dept.image} 
                  alt={dept.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-center font-medium text-gray-700 group-hover:text-[#f4d3d2] transition-colors">
                {dept.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold">Destaques</h2>
              <p className="text-gray-600 mt-2">Nossos produtos mais amados por você.</p>
            </div>
            <Link to="/departamento/velas-aromaticas" className="text-[#f4d3d2] font-medium border-b-2 border-[#f4d3d2] pb-1 hover:opacity-70 transition-opacity">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
