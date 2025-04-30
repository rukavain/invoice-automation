"use client";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import Image from "next/image";
import { Plus, Minus, Divide } from "lucide-react";
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

type FormProduct = {
  id: number;
  quantity: number;
  product_name: string;
  price: number;
  description?: string;
  onhand_quantity: number;
  image: string;
};

// type FormData = {
//   name: string;
//   email: string;
//   message: string;
//   products: FormProduct[];
// };

type Inputs = {
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
  const [formData, setFormData] = useState<Inputs>({
    name: "",
    email: "",
    message: "",
    products: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Inputs>();

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
      // First, check if product already exists in formData
      const existingProductIndex = prevFormData.products.findIndex(
        (p: any) => p.id === id
      );

      let updatedProducts = [...prevFormData.products];

      if (quantity === 0) {
        // If quantity is 0, REMOVE the product from the list
        updatedProducts = updatedProducts.filter((p) => p.id !== id);
      } else {
        if (existingProductIndex !== -1) {
          // If it exists, update the quantity
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity,
          };
        } else {
          // Otherwise, ADD the product
          updatedProducts.push({
            id: selected.id,
            quantity,
            product_name: selected.name,
            price: selected.price,
            description: selected.description,
            onhand_quantity: selected.onhand_quantity ?? 0,
            image: selected.image,
          });
        }
      }

      return { ...prevFormData, products: updatedProducts };
    });
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const selectedProducts = products
      .filter((product) => quantities[product.id] > 0)
      .map((product) => ({
        id: product.id,
        quantity: quantities[product.id],
        product_name: product.name,
        price: product.price,
        description: product.description,
        onhand_quantity: product.onhand_quantity ?? 0,
        image: product.image,
      }));

    if (selectedProducts.length === 0) {
      toast("No products selected.", {
        description: "Please select at least one product.",
      });
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      message: data.message,
      products: selectedProducts,
    };

    const res = await fetch(`/api/quotation-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast("Quotation successfully submitted!", {
        description: `Quotation was sent to ${payload.email}`,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });
    } else {
      toast("Failed to submit quotation request.", {
        description: `Quotation failed to send to ${payload.email}`,
        action: {
          label: "Close",
          onClick: () => console.log(""),
        },
      });
    }
  };

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
        onSubmit={handleSubmit(onSubmit)}
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
            <div className="min-w-[300px] max-lg:min-w-[180px] h-full focus:outline-none">
              <p className="font-semibold text-xl mb-4">Submit Quotation</p>
              <input
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Name is required.",
                  },
                })}
                className="border p-2 w-full "
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required.",
                  },
                })}
                className="border p-2 w-full my-2"
              />
              <textarea
                placeholder="Message"
                className="border p-2 w-full"
                {...register("message")}
              />
              {errors.name && <span>{errors.name.message}</span>}
              {errors.email && <span>{errors.email.message}</span>}
              <div className="flex justify-start items-start w-full">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 cursor-pointer rounded ${
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
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
