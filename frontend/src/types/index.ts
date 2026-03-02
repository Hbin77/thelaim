export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  category_slug: string;
  category_name: string;
  image_url: string;
  image_urls: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface ContactFormData {
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  product_interest?: string;
  message: string;
  preferred_contact: 'email' | 'phone' | 'kakao';
}

export interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
