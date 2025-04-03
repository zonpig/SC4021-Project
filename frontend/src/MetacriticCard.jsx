import React from "react";

function MetacriticCard({ review }) {
  const {
    game,
    gaming_platform,
    platform,
    review_text,
    review_type,
    score,
    sentiment,
    timestamp_updated_date: timestamp,
    username,
  } = review;

  return (
    <div className="p-6 shadow-lg rounded-lg border border-gray-300 max-w-3xl w-full mx-auto bg-[#1b1b1b] text-white">
      <div className="bg-[#2d2d2d] p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{game}</h2>
      </div>
      <div className="p-4 bg-[#404040] rounded-b-lg">
        <p className="text-gray-300 text-sm mb-1">Platform: {platform}</p>
        <p className="text-gray-300 text-sm">
          Reviewer: {username} ({review_type})
        </p>
        <p className="text-gray-300 text-sm">
          Updated: {new Date(timestamp).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm">
          Gaming Device: {gaming_platform}
        </p>
        <p className="text-gray-300 text-sm">Review: "{review_text}"</p>
        <p className="text-gray-300 text-sm">Score: {score}/100</p>
        <p className="text-gray-300 text-sm">Sentiment: {sentiment}</p>
      </div>
    </div>
  );
}

export default MetacriticCard;
