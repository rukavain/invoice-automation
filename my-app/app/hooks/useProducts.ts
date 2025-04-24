import { useEffect, useState } from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.result.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.Image,
          price: item["Sales Price"],
          description: item["Sales Description"],
        }));
        setProducts(formatted);
      });
  }, []);

  return products;
}
