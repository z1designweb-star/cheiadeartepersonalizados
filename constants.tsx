
import { Department, Product } from './types.ts';

export const DEPARTMENTS: Department[] = [
  { id: 'velas-religiosas', name: 'Velas Religiosas', image: 'https://images.unsplash.com/photo-1602850457221-8740f9074092?auto=format&fit=crop&q=80&w=400' },
  { id: 'velas-aromaticas', name: 'Velas Aromáticas', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400' },
  { id: 'aromatizadores', name: 'Aromatizadores', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400' },
  { id: 'lembrancinhas', name: 'Lembrancinhas', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400' },
  { id: 'kits-lavabo', name: 'Kits Lavabo', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
  { id: 'home-decor', name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400' },
  { id: 'sabonetes', name: 'Sabonetes', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=400' },
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  DEPARTMENTS.forEach((dept) => {
    for (let i = 1; i <= 6; i++) {
      // Fix: Used correct property names and added missing required fields from Product interface
      products.push({
        id: `${dept.id}-${i}`,
        name: `${dept.name} Artesanal ${i}`,
        price: Math.floor(Math.random() * (150 - 30) + 30) + 0.9,
        image_url: `https://picsum.photos/seed/${dept.id}-${i}/400/500`,
        department_id: dept.id,
        description: `Um produto exclusivo da linha ${dept.name}, feito com as melhores matérias-primas para perfumar e decorar seu ambiente com carinho e arte.`,
        models: [],
        aromas: [],
        weight_grams: 0,
        height_cm: 0,
        width_cm: 0,
        length_cm: 0,
        variations: []
      });
    }
  });
  return products;
};

export const ALL_PRODUCTS = generateProducts();

export const FEATURED_PRODUCTS = ALL_PRODUCTS.slice(0, 6);
