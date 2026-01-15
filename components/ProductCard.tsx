
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatDriveUrl } from '../lib/utils.ts';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = formatDriveUrl(product.image_url);

  return (
    <div className="group relative bg-white">
      <Link to={`/produto/${product.id}`} className="block overflow-hidden rounded-lg aspect-[4/5] bg-gray-50 border border-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            console.error("Erro ao carregar imagem:", imageUrl);
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=Verifique+o+Link+no+Drive';
            (e.target as HTMLImageElement).classList.add('opacity-50');
          }}
        />
      </Link>
      <div className="mt-4 flex flex-col items-center px-2">
        <h3 className="text-sm text-gray-700 font-medium text-center line-clamp-1">{product.name}</h3>
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
