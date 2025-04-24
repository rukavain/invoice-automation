"use client";
import "../../../products.json";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import Image from "next/image";

export default function QuotationForm() {
  const { products, loading, error } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(0);
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quotation/send/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      alert("Quotation submitted!");
    } else {
      alert("Failed to submit");
    }
  };
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
      <div className="fixed bg-white rounded-lg p-2 shadow-lg gap-2 flex flex-col justify-start items-start w-full max-w-md">
        <p
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center cursor-pointer"
        >
          <span>Form</span>
          <span>{isOpen && "X"}</span>
        </p>
        {isOpen && (
          <div>
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full "
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full "
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Message"
              className="border p-2 w-full "
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <div className="mt-18">
        <p className="font-bold mb-2">Select Products</p>
        <div className="flex flex-wrap gap-2 justify-start items-start">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between items-center gap-4 p-2 border rounded mb-2 w-full max-w-2xs h-[390px]" // fixed height
            >
              <div className="h-44 w-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="border border-red-600 object-fit h-full w-full"
                />
              </div>

              {/* Product Info */}
              <div className="w-full text-center border">
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-gray-600">₱{product.price}</p>
                {/* Optional description */}
                {/* <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {product.description}
      </p> */}
              </div>

              <div>
                <input
                  type="number"
                  min={0}
                  placeholder="Qty"
                  className="border w-16 p-1"
                  onChange={(e) =>
                    handleProductChange(
                      product.id,
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
