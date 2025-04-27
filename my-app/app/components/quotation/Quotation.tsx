"use client";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    handleProductChange(id, newQuantity);
  };

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
      alert("Quotation submitted!");
    } else {
      alert("Failed to submit");
    }
  };

  if (loading)
    return (
      <div className=" bg-white h-full w-full flex justify-center items-center flex-col gap-4">
        <div className="flex bg-white flex-col justify-center items-center">
          <div className="flex justify-center items-center gap-4 ">
            {/* <Image
              src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
              alt="Easemart Logo"
              width={300}
              height={300}
            /> */}
          </div>
          <Image width={100} height={100} alt="Loading" src={"/loading.gif"} />
        </div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <form onSubmit={handleSubmit} className="relative  w-full flex">
      <div
        onClick={() => setOpen(!open)}
        className="py-4 px-4 fixed bottom-12 right-12 flex justify-center items-center cursor-pointer  rounded-full bg-blue-500 "
      >
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
            <div className="">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 cursor-pointer rounded"
              >
                Submit
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
      <div className="">
        {/* <p className="font-semibold text-xl">Products</p> */}
        <div className="flex flex-wrap justify-start items-start gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex shadow-lg flex-col justify-between items-center gap-4  border border-gray-300 rounded-lg  w-full max-w-xs h-[390px]" // fixed height
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-64 w-full cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="object-scale-down h-full w-full"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogTitle>₱ {product.price}</DialogTitle>
                    <DialogDescription>{product.description}</DialogDescription>
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

              <div className="w-full  rounded-b-xl m-0 border-gray-300 flex justify-between items-center">
                <Button
                  type="button"
                  className=""
                  onClick={() => {
                    const currentQty = quantities[product.id] || 0;
                    const newQty = Math.max(currentQty - 1, 0); // Don't go below 0
                    handleQuantityChange(product.id, newQty);
                  }}
                  variant="secondary"
                >
                  <Minus />
                </Button>
                {/* <button
                  type="button"
                  className="text-3xl rounded-sm cursor-pointer bg-blue-500 text-white text-center w-full"
                >
                  -
                </button> */}

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

                {/* <button
                  type="button"
                  onClick={() => {
                    const currentQty = quantities[product.id] || 0;
                    const newQty = currentQty + 1;
                    handleQuantityChange(product.id, newQty);
                  }}
                  className="text-3xl rounded-sm cursor-pointer bg-blue-500 text-white text-center w-full"
                >
                  <Plus />
                  
                </button> */}
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
  );
}
