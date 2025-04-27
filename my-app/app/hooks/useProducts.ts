import { useEffect, useState } from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  onhand_quantity?: number;
  internalReference?: string | false; // It can be `false` in your data
  barcode?: string | false;
  cost?: number;
  categories?: string[];
  average_rating?: number | null;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/");
        const data = await res.json();

        const formatted = data.result.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.Image,
          price: item["Sales Price"],
          description: item["Sales Description"],
          onhand_quantity: item["On Hand Quantity"],
          internalReference: item["Internal Reference"],
          barcode: item["Barcode"],
          cost: item["Cost"],
          categories: item["Ecommerce Categories"],
          average_rating: item["average_rating"],
        }));

        setProducts(formatted);
      } catch (err: any) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
