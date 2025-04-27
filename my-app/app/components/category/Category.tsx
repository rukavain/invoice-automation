import React from "react";

const Category = () => {
  return (
    <div className="flex flex-col min-w-sm justify-start items-start border h-full">
      <p className="font-semibold text-xl">Categories</p>
      <div className="flex justify-start items-center gap-2">
        <input type="radio" />
        <p className="text-lg">Category 1</p>
      </div>
    </div>
  );
};

export default Category;
