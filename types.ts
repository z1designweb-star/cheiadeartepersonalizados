
export interface Variation {
  model: string;
  aroma: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  department_id: string;
  models: string[];
  aromas: string[];
  weight_grams: number;
  height_cm: number;
  width_cm: number;
  length_cm: number;
  variations: Variation[];
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  image: string;
}

export interface Profile {
  id: string;
  email: string;
  is_approved: boolean;
  is_admin: boolean;
}
