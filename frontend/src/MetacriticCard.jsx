import React from "react";
import SentimentBadge from "./Sentiment";
import MetacriticScore from "./MetacriticScore";

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
    // <div className="p-6 shadow-lg rounded-lg border border-gray-300 max-w-5xl w-full mx-auto text-white">
    <div className=" shadow-lg rounded-lg w-full mx-auto bg-gray-100 border border-gray-300">
      <div className="text-white py-2 px-4 rounded-t-lg flex flex-row justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-black">{game}</h2>
        </div>
        <div>
          <img
            src='/metacritic.png'
            alt="Platform Logo"
            className="h-10 py-2 object-contain flex justify-end"
          />
        </div>
      </div>
      <div className="p-4 rounded-b-lg flex flex-col bg-white">
        <div className = "flex flex-row justify-between items-center">
          <div>
          <p className="text-sm font-bold">
            By: {username} ({review_type})
          </p>
          <p className="text-sm">
            Gaming Device: {gaming_platform}
          </p>
          </div>
          <div className="flex justify-end">
            <SentimentBadge sentiment={sentiment} />
          </div>
        </div>
        <div className="rounded-lg bg-gray-200 p-4 my-2">
          <p className="text-gray-800 text-sm">{review_text}</p>
        </div>
        <div className = "flex flex-row justify-between items-center">
          <MetacriticScore score={score} />

          <div className="text-gray-500 text-sm flex justify-end">
            Updated: {new Date(timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetacriticCard;
