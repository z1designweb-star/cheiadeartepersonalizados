
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
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  phone?: string;
  cep?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  is_approved: boolean;
  is_admin: boolean;
}

export interface ShippingOption {
  id: string | number;
  name: string;
  price: number;
  delivery_time: number;
  company: {
    name: string;
    picture: string;
  };
}

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  total_amount: number;
  shipping_cost: number;
  shipping_method: string;
  items: any[];
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  created_at: string;
}
