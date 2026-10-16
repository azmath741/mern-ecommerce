import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 my-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="Previous Page"
      >
        <FiChevronLeft className="text-lg" />
      </button>

      {/* Pages */}
      {pageNumbers.map((p) => {
        // Show first, last, and current +/- 1, with ellipsis
        if (
          p === 1 ||
          p === pages ||
          (p >= page - 1 && p <= page + 1)
        ) {
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                p === page
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          );
        } else if (p === page - 2 || p === page + 2) {
          return (
            <span key={p} className="px-1 text-slate-400 select-none">
              ...
            </span>
          );
        }
        return null;
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="Next Page"
      >
        <FiChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default Pagination;

