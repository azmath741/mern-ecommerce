import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const EmptyState = ({
  icon: Icon = FiShoppingBag,
  title = "No items found",
  description = "We couldn't find what you were looking for.",
  actionText = "Continue Shopping",
  actionLink = "/shop",
  onAction,
}) => {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-3xl mb-4">
        <Icon />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm hover:shadow"
        >
          {actionText}
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm hover:shadow"
        >
          {actionText}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;

