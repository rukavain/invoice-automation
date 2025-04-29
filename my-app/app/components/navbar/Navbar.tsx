"use client";

import React, { useState } from "react";
import Link from "next/link";
import Category from "@/app/components/category/Category";
import Image from "next/image";

const Navbar = ({
  onSearch,
  onSelectCategory,
}: {
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Products");
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <nav className=" relative w-full p-4 text-blue-500 flex justify-center max-lg:flex-col items-center gap-4">
      <div className="min-h-max flex justify-center items-center gap-4 bg-white p-2">
        <Image
          src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
          alt="Easemart Logo"
          width={220}
          className="min-w-52 max-lg:min-w-32"
          height={220}
        />
      </div>
      <div className="flex relative w-full max-w-lg justify-start items-center gap-4">
        <input
          className="w-full  border shadow-lg max-w-lg p-2  border-gray-300 rounded-sm focus:outline-none text-gray-800"
          type="search"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute text-gray-300 right-3 cursor-pointer"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 50 50"
        >
          <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
        </svg>
        <Category onSelectCategory={handleCategorySelect} />
      </div>
    </nav>
  );
};

export default Navbar;
