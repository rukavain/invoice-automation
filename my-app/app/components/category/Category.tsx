import React from "react";

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

const Category = () => {
  return (
    <div className="flex flex-col gap-2 min-w-max">
      <h1 className="text-3xl font-semibold">Categories</h1>
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex cursor-pointer justify-start items-center gap-2"
        >
          <input
            type="radio"
            name="category"
            id={`category-${index}`}
            value={category}
            className="cursor-pointer"
          />
          <label
            htmlFor={`category-${index}`}
            className="text-lg  cursor-pointer max-w-xs"
          >
            {category}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Category;
