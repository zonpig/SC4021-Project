import React from "react";

export default function MetacriticScore({ score }) {

  const getScoreBgColor = (score) => {
    if (score >= 75) {
      return "bg-green-400 text-green-800";
    } else if (score >= 50 && score <= 74) {
      return "bg-orange-400 text-orange-800";
    } else {
      return "bg-red-400 text-red-800"; // Below 50
    }
  };

  return (
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(score)}`}>
      {score}/100
    </div>
  );
}
