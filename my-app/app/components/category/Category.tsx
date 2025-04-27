"use client";
import React from "react";
import { useState } from "react";

const categories = [
  "All Products",
  "Botulinum Toxin",
  "Hyaluronidase",
  "Oral Supplements & Vitamins",
  "Slimming Injection",
  "Special Offers",
  "Drip Sets",
  "IV Products",
  "Fillers",
  "Threads",
  "Anesthesia",
  "Skin Boosters",
  "Hair Growth",
  "OEM/ODM Product",
  "Face Masks",
  "Medical Supplies",
  "Others",
  "Machines",
  "Machines / Brandnew",
  "Machines / Refurbished",
  "Machines / Machine's Consumable",
  "Fight For Covid-19",
  "Fight For Covid-19 / PPEs, Equipment and Testing Kits",
  "Easethetics Consumable",
];

type CategoryProps = {
  onSelectCategory: (category: string) => void;
};

const Category = ({ onSelectCategory }: CategoryProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col gap-2 min-w- z-50 bg-white p-2 rounded-md shadow-lg border border-gray-300">
      <h1
        onClick={() => setOpen(!open)}
        className=" text-gray-800  cursor-pointer font-semibold text-sm"
      >
        Categories
      </h1>
      {open && (
        <div className="top-12 left-0 border absolute min-w-max bg-white p-4 text-left rounded-md shadow-lg">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => {
                onSelectCategory(category);
                setOpen(false);
              }}
              className="flex hover:bg-gray-200 p-2 rounded-sm border-b py-2 cursor-pointer justify-start items-center gap-2"
            >
              <label
                htmlFor={`category-${index}`}
                className="text-sm text-gray-800  cursor-pointer max-w-xs"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
