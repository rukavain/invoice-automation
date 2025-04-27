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
  onhand_quantity: number;
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
  const [open, setOpen] = useState(false);
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
            onhand_quantity: selected.onhand_quantity,
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
      <div className=" bg-white w-svw h-svh flex justify-center items-center flex-col gap-4">
        <div className="flex absolute bg-white w-svw h-svh flex-col justify-center items-center">
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
    <form onSubmit={handleSubmit} className=" w-full flex">
      <div className="fixed bottom-0 right-0  bg-white rounded-lg p-2 shadow-lg gap-2 flex flex-col justify-start items-start w-full max-w-md">
        <p onClick={() => setOpen(!open)}>Form</p>
        {open && (
          <div className="min-w-[300px] h-full focus:outline-none">
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
              className="border p-2 w-full my-2"
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
      <div className="">
        {/* <p className="font-semibold text-xl">Products</p> */}
        <div className="flex flex-wrap justify-start items-start gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex shadow-lg flex-col justify-between items-center gap-4  border border-gray-300 rounded-lg  w-full max-w-xs h-[390px]" // fixed height
            >
              <div className="h-64 w-full ">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-scale-down h-full w-full"
                />
              </div>

              <div className="w-full flex-col justify-start items-start gap-5 p-2">
                {/* <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="text-gray-600">₱{product.price}</p>
                </div> */}
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-gray-600">₱{product.price}</p>
              </div>

              <div className="w-full border rounded-xl border-gray-300 bg-blue-500 flex justify-between items-center">
                <button
                  type="button"
                  className="text-3xl rounded-sm cursor-pointer bg-blue-500 text-white text-center w-full"
                >
                  +
                </button>
                <input
                  type="number"
                  min={0}
                  placeholder="Qty"
                  className="text-center p-1 bg-white w-full h-full"
                  onChange={(e) =>
                    handleProductChange(
                      product.id,
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <button
                  type="button"
                  className="text-3xl rounded-sm cursor-pointer bg-blue-500 text-white text-center w-full"
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
