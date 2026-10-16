import React from "react";

const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col gap-3"
        >
          <div className="w-full aspect-square bg-slate-200 rounded-xl"></div>
          <div className="flex justify-between items-center gap-2">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="h-5 bg-slate-200 rounded w-4/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="mt-auto pt-2 flex items-center justify-between gap-3">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;

