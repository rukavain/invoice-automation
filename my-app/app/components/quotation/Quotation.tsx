// app/quotation/page.tsx or pages/quotation.tsx
"use client";
import "../../../products.json";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
};

type FormProduct = {
  id: number;
  quantity: number;
  product_name: string;
  price: number;
  description: string;
  image: string;
};

export default function QuotationForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    products: [] as FormProduct[],
  });

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded data:", data);
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

  const handleProductChange = (id: number, quantity: number) => {
    const selected = products.find((p) => p.id === id);
    if (!selected) return;

    setFormData((prev) => {
      const filtered = prev.products.filter((p) => p.id !== id);
      const newProduct = {
        id: selected.id,
        quantity,
        product_name: selected.name,
        price: selected.price,
        description: selected.description || "",
        image: selected.image || "",
      };
      return {
        ...prev,
        products: quantity > 0 ? [...filtered, newProduct] : filtered,
      };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/quotation/send/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Quotation submitted!");
    } else {
      alert("Failed to submit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="border p-2"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Message"
        className="border p-2"
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <div>
        <p className="font-bold mb-2">Select Products</p>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-start gap-4 p-2 border rounded mb-2"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-600">₱{product.price}</p>
              {product.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {product.description}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                min={0}
                placeholder="Qty"
                className="border w-16 p-1"
                onChange={(e) =>
                  handleProductChange(product.id, parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
