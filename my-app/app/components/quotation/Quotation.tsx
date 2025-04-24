"use client";
import "../../../products.json";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";

export default function QuotationForm() {
  const { products, loading, error } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    products: [],
  });

  const handleProductChange = (id: number, quantity: number) => {
    const selected = products.find((p) => p.id === id);
    if (!selected) return;
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
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
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
