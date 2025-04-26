"use client";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import Image from "next/image";

type FormProduct = {
  id: number;
  quantity: number;
  product_name: string;
  price: number;
  description?: string;
  image: string;
};

type FormData = {
  name: string;
  email: string;
  message: string;
  products: FormProduct[];
};

export default function QuotationForm() {
  const { products, loading, error } = useProducts();
  const [qty, setQty] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    products: [],
  });

  const handleProductChange = (id: number, quantity: number) => {
    const selected = products.find((p) => p.id === id);
    if (!selected) return;

    setFormData((prevFormData) => {
      const existingProductIndex = prevFormData.products.findIndex(
        (p: any) => p.id === id
      );

      let updatedProducts;

      if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        updatedProducts = [...prevFormData.products];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity,
        };
      } else {
        // Add new product if it doesn't exist
        updatedProducts = [
          ...prevFormData.products,
          {
            id: selected.id,
            quantity,
            product_name: selected.name,
            price: selected.price,
            description: selected.description,
            image: selected.image,
          },
        ];
      }

      return { ...prevFormData, products: updatedProducts };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/quotation-email`, {
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

  if (loading)
    return (
      <div className=" bg-white  w-svw h-svh flex justify-center items-center flex-col gap-4">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center gap-4 ">
            <Image
              src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
              alt="Easemart Logo"
              width={300}
              height={300}
            />
          </div>
          <Image width={100} height={100} alt="Loading" src={"/loading.gif"} />
        </div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full flex">
      <div className="mt-18">
        <p className="font-bold mb-2">Select Products</p>
        <div className="flex flex-wrap justify-start items-start">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between items-center gap-4  border border-gray-300 rounded  w-full max-w-xs h-[390px]" // fixed height
            >
              <div className="h-64 w-64 border">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-fit h-full w-full"
                />
              </div>

              <div className="w-full text-left border">
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-gray-600">₱{product.price}</p>
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
        <div className="  bg-white rounded-lg p-2 shadow-lg gap-2 flex flex-col justify-start items-start w-full max-w-md">
          <div className="min-w-[300px] border h-full">
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
        </div>
      </div>
    </form>
  );
}
