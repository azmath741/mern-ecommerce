import React from "react";

export const Spinner = ({ size = "w-6 h-6", color = "text-indigo-600" }) => (
  <svg
    className={`animate-spin ${size} ${color}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

export const ButtonLoader = ({ text = "Processing..." }) => (
  <div className="flex items-center justify-center gap-2">
    <Spinner size="w-4 h-4" color="text-white" />
    <span>{text}</span>
  </div>
);

export const ScreenLoader = ({ message = "Loading..." }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
    <Spinner size="w-10 h-10" color="text-indigo-600" />
    <p className="text-sm font-medium text-slate-500 animate-pulse">
      {message}
    </p>
  </div>
);

export default Spinner;

