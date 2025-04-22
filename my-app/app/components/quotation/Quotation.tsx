// app/quotation/page.tsx or pages/quotation.tsx
"use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Product A", price: 50 },
  { id: 2, name: "Product B", price: 75 },
  { id: 3, name: "Product C", price: 100 },
];

export default function QuotationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    products: [] as { id: number; quantity: number }[],
  });

  const handleProductChange = (id: number, quantity: number) => {
    setFormData((prev) => {
      const existing = prev.products.find((p) => p.id === id);
      let newProducts = prev.products.filter((p) => p.id !== id);
      if (quantity > 0) {
        newProducts.push({ id, quantity });
      }
      return { ...prev, products: newProducts };
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
          <div key={product.id}>
            <label>
              {product.name} (₱{product.price})
            </label>
            <input
              type="number"
              min={0}
              placeholder="Qty"
              className="border ml-2 w-16"
              onChange={(e) =>
                handleProductChange(product.id, parseInt(e.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
