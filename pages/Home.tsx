
import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, FEATURED_PRODUCTS } from '../constants.tsx';
import ProductCard from '../components/ProductCard.tsx';

const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section Atualizada */}
      <section className="bg-[#f4d3d2] min-h-[70vh] flex items-center py-16 md:py-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo: Texto */}
            <div className="order-2 md:order-1">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
                Cheia de Arte: <br/>
                <span className="text-white">Aromas que Curam</span>
              </h1>
              <p className="text-xl text-gray-800 mb-8 leading-relaxed max-w-xl">
                Descubra a harmonia em cada detalhe. Nossos produtos aromáticos são criados manualmente para despertar sentimentos e transformar sua rotina.
              </p>
              <Link 
                to="/departamento/velas-aromaticas"
                className="inline-block px-8 py-4 bg-white text-[#f4d3d2] rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Explorar Coleção
              </Link>
            </div>

            {/* Lado Direito: Imagem 1:1 */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white/30 transition-transform hover:scale-[1.02] duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800" 
                  alt="Produto Cheia de Arte" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-gray-900">Nossos Departamentos</h2>
          <div className="w-20 h-1 bg-[#f4d3d2] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {DEPARTMENTS.map((dept) => (
            <Link 
              key={dept.id} 
              to={`/departamento/${dept.id}`}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-md mb-4 group-hover:border-[#f4d3d2] transition-colors bg-gray-50">
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
              <h2 className="text-4xl font-serif font-bold text-gray-900">Destaques</h2>
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
