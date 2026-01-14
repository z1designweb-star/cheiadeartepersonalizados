
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  departmentId: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  image: string;
}
