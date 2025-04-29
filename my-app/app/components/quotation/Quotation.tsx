"use client";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "../navbar/Navbar";
import { toast } from "sonner";
import SubmitButton from "../button/SubmitButton";

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

type Inputs = {
  id: number;
  quantity: number;
  product_name: string;
  price: number;
  description?: string;
  onhand_quantity: number;
  image: string;
  name: string;
  email: string;
  message: string;
  products: FormProduct[];
};

export default function QuotationForm() {
  const { products, loading, error } = useProducts();
  const [quantities, setQuantities] = useState<{ [productId: number]: number }>(
    {}
  );
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    products: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    handleProductChange(id, newQuantity);
  };
  const filteredProducts = products.filter((product: any) => {
    const matchesCategory =
      selectedCategory === "All Products" ||
      (product.categories && product.categories.includes(selectedCategory));

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
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
            onhand_quantity: selected.onhand_quantity ?? 0, // <== FIX HERE
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
      toast("Quotation successfully submitted!", {
        description: `Quotation was sent to ${formData.email}`,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });
    } else {
      toast("Failed to submit quotation request.", {
        description: `Quotation failed to send at ${formData.email}`,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });
    }
  };

  console.log("product:", products);

  if (loading)
    return (
      <div className=" bg-white h-svh w-full flex justify-center items-center flex-col gap-4">
        <div className="flex bg-white flex-col justify-center items-center">
          <Image
            src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
            alt="Easemart Logo"
            width={220}
            className="min-w-68 max-lg:min-w-32"
            height={220}
          />
          <Image width={300} height={300} alt="Loading" src={"/loading.gif"} />
        </div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div>
      <Navbar
        onSearch={setSearchQuery}
        onSelectCategory={setSelectedCategory}
      />
      <p className="text-center text-2xl font-bold my-6">{selectedCategory}</p>
      <form
        onSubmit={handleSubmit}
        className="relative flex justify-center items-center w-full "
      >
        <div
          onClick={() => setOpen(!open)}
          className="py-4 px-4 fixed bottom-12 right-12 flex group justify-center items-center cursor-pointer delay-200  transition-all  rounded-full bg-blue-500 "
        >
          <p className="bg-white -top-7 right-0 min-w-max absolute hidden group-hover:block  transition-all rounded-md text-sm  p-2 shadow-lg ">
            Request Quotation
          </p>
          <svg
            className="w-8 h-8 text-white dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {open && (
          <div className="fixed border-2 border-gray-400 bottom-4 right-4  bg-white rounded-lg p-5 shadow-xl gap-2 flex flex-col justify-start items-start w-full max-w-md">
            <div className="min-w-[300px] h-full focus:outline-none">
              <p className="font-semibold text-xl mb-4">Submit Quotation</p>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                className="border p-2 w-full "
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                className="border p-2 w-full my-2"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Message"
                className="border p-2 w-full "
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              <div className="">
                <SubmitButton
                  type="submit"
                  className="bg-blue-500 text-white p-2 cursor-pointer rounded"
                  label="Submit"
                />
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="bg-gray-200 mx-2 cursor-pointer p-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className=" max-lg:flex max-lg:flex-wrap max-lg:justify-center max-lg:items-center">
          {/* <p className="font-semibold text-xl">Products</p> */}
          <div className="flex flex-wrap justify-center items-center max-lg:flex max-lg:flex-wrap max-lg:justify-center max-lg:items-center  gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex shadow-lg flex-col justify-between items-center gap-4  border border-gray-300 rounded-lg  w-full max-w-[300px] h-[390px] max-lg:min-h-max max-lg:max-w-[120px]" // fixed height
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="h-64 max-lg:h-min  w-full cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="max-lg:h-min  object-scale-down h-full w-full"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogTitle>₱ {product.price}</DialogTitle>
                      <DialogDescription>
                        {product.description}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="w-full flex-col justify-start items-start gap-5 p-2">
                  {/* <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="text-gray-600">₱{product.price}</p>
                </div> */}
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="text-gray-600">₱{product.price}</p>
                </div>

                <div className="w-full border-y rounded-b-xl m-0 border-gray-300 flex justify-between items-center">
                  <Button
                    type="button"
                    onClick={() => {
                      const currentQty = quantities[product.id] || 0;
                      const newQty = Math.max(currentQty - 1, 0);
                      handleQuantityChange(product.id, newQty);
                    }}
                    variant="secondary"
                  >
                    <Minus />
                  </Button>
                  <input
                    type="number"
                    min={0}
                    value={quantities[product.id] || 0}
                    placeholder="Qty"
                    className="text-center p-1 bg-white w-full h-full"
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleQuantityChange(product.id, value);
                    }}
                  />
                  <Button
                    type="button"
                    className=""
                    onClick={() => {
                      const currentQty = quantities[product.id] || 0;
                      const newQty = Math.max(currentQty + 1, 0); // Don't go below 0
                      handleQuantityChange(product.id, newQty);
                    }}
                    variant="secondary"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
