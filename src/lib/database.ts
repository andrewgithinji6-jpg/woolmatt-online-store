import { supabase } from './supabase';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number;
  category_id: number;
  rating: number;
  reviews: number;
  in_stock: boolean;
  image_url: string;
  created_at: string;
  category?: {
    name: string;
    icon: string;
  };
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(name, icon)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

// Get products by category
export async function getProductsByCategory(
  categoryId: number
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

// Get single product
export async function getProduct(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(name, icon)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

// Add product
export async function addProduct(product: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }

  return data?.[0] || null;
}

// Update product
export async function updateProduct(
  id: number,
  updates: Partial<Product>
) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data?.[0] || null;
}

// Delete product
export async function deleteProduct(id: number) {
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
}

// Get image URL from storage
export function getImageUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${filename}`;
}

// Upload image
export async function uploadImage(
  file: File,
  category: string
): Promise<string | null> {
  const filename = `${category}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(filename, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return filename;
}