// SVG placeholder as data URL - no file needed
export const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E`;

export const getImageUrl = (imagePath: string): string => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!imagePath) {
    return PLACEHOLDER_SVG;
  }

  return `${supabaseUrl}/storage/v1/object/public/products/${imagePath}`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = PLACEHOLDER_SVG;
};