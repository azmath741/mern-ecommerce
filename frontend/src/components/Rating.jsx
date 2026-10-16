import React from "react";
import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ value = 0, text = "", size = "text-sm" }) => {
  const ratingValue = Number(value) || 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center text-amber-400 ${size}`}>
        {[1, 2, 3, 4, 5].map((index) => {
          if (ratingValue >= index) {
            return <FaStar key={index} />;
          } else if (ratingValue >= index - 0.5) {
            return <FaStarHalfAlt key={index} />;
          } else {
            return <FiStar key={index} className="text-slate-300" />;
          }
        })}
      </div>
      {text && (
        <span className="text-xs font-medium text-slate-500">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;

