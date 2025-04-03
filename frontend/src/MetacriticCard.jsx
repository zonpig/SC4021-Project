import React from "react";

function MetacriticCard() {
  const review = {
    game: "Cyberpunk 2077",
    gaming_platform: "PC",
    platform: "Metacritic",
    review_text:
      "Cyberpunk 2077 isn't perfect, but it is ambitious.… soon. Phenomenal, that's what Cyberpunk 2077 is.",
    review_type: "critic",
    score: 100,
    sentiment: "negative",
    timestamp: "2020-12-07T00:00:00Z",
    username: "GameSpew",
  };

  return (
    <div className="p-6 shadow-lg rounded-lg border border-gray-300 max-w-md mx-auto bg-[#1b1b1b] text-white">
      <div className="bg-[#2d2d2d] p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{review.game}</h2>
      </div>
      <div className="p-4 bg-[#404040] rounded-b-lg">
        <p className="text-gray-300 text-sm mb-1">
          Platform: {review.platform}
        </p>
        <p className="text-gray-300 text-sm">
          Reviewer: {review.username} ({review.review_type})
        </p>
        <p className="text-gray-300 text-sm">
          Updated: {new Date(review.timestamp).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm">
          Gaming Device: {review.gaming_platform}
        </p>
        <p className="text-gray-300 text-sm">Review: "{review.review_text}"</p>
        <p className="text-gray-300 text-sm">Score: {review.score}/100</p>
        <p className="text-gray-300 text-sm">Sentiment: {review.sentiment}</p>
      </div>
    </div>
  );
}

export default MetacriticCard;
