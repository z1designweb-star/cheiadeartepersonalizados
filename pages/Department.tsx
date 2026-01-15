
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants.tsx';
import { Department as DepartmentType, Product } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import ProductCard from '../components/ProductCard.tsx';
import { ChevronRight, Home, Loader2 } from 'lucide-react';

const Department: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<DepartmentType | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      setLoading(true);
      const dept = DEPARTMENTS.find(d => d.id === id);
      setDepartment(dept);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('department_id', id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar departamento:", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchDepartmentData();
  }, [id]);

  if (!department) return <div className="p-20 text-center font-serif text-2xl">Departamento não encontrado.</div>;

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="relative h-64 bg-gray-900 flex items-center justify-center">
        <img 
          src={department.image} 
          alt={department.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-serif font-bold">{department.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-12">
          <Link to="/" className="hover:text-[#f4d3d2] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{department.name}</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#f4d3d2]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-20 text-center text-gray-500 italic">
                Nenhum produto encontrado neste departamento no momento.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Department;
