import { API_BASE_URL } from './constants';
import type { Product, Category, ContactFormData, ApiResponse } from '@/types';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return fetchApi<ApiResponse<Product>>(`/api/products${query ? `?${query}` : ''}`);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return fetchApi<Product[]>('/api/products/featured');
}

export async function getProduct(slug: string): Promise<Product> {
  return fetchApi<Product>(`/api/products/${slug}`);
}

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>('/api/categories');
}

export async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  return fetchApi('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
