import { API_BASE_URL } from './constants';
import type { Product, Category, ContactFormData, ApiResponse } from '@/types';

// 서버 컴포넌트에서는 컨테이너 내부 주소로, 브라우저에서는 nginx 프록시(상대 경로)로 호출한다.
const SERVER_API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function apiBase(): string {
  return typeof window === 'undefined' ? SERVER_API_URL : API_BASE_URL;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${endpoint}`, {
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
  lang?: string;
}): Promise<ApiResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.lang) searchParams.set('lang', params.lang);

  const query = searchParams.toString();
  return fetchApi<ApiResponse<Product>>(`/api/v1/products${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });
}

export async function getFeaturedProducts(lang?: string): Promise<Product[]> {
  const query = lang ? `?lang=${lang}` : '';
  return fetchApi<Product[]>(`/api/v1/products/featured${query}`, { cache: 'no-store' });
}

export async function getProduct(slug: string, lang?: string): Promise<Product> {
  const query = lang ? `?lang=${lang}` : '';
  return fetchApi<Product>(`/api/v1/products/${slug}${query}`, { cache: 'no-store' });
}

export async function getCategories(lang?: string): Promise<Category[]> {
  const query = lang ? `?lang=${lang}` : '';
  return fetchApi<Category[]>(`/api/v1/categories${query}`, { cache: 'no-store' });
}

export async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  return fetchApi('/api/v1/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
