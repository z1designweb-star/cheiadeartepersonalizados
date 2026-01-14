
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white">
      <Link to={`/produto/${product.id}`} className="block overflow-hidden rounded-lg aspect-[4/5] bg-gray-100">
        {/* Fix: Using image_url instead of image to match Product interface */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="mt-4 flex flex-col items-center">
        <h3 className="text-sm text-gray-700 font-medium text-center">{product.name}</h3>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <Link
          to={`/produto/${product.id}`}
          className="mt-3 w-full py-2 bg-[#f4d3d2] text-white text-center rounded-md font-medium hover:bg-[#e6c1c0] transition-colors"
        >
          Comprar
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
