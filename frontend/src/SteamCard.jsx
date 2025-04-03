import React from "react";

function SteamCard() {
  const review = {
    author_steamid: "76561199124653300",
    game: "Cyberpunk 2077",
    platform: "Steam",
    review_text:
      "This is going to be Oakland through Hayward, CA in about 4 years",
    sentiment: "negative",
    timestamp: "2025-02-13T00:00:00Z",
    votes_funny: 0,
    votes_up: 0,
    weighted_vote_score: 0.5,
  };

  return (
    <div className="p-6 shadow-lg rounded-lg border border-gray-300 max-w-md mx-auto bg-[#171a21] text-white">
      <div className="bg-[#1b2838] p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{review.game}</h2>
      </div>
      <div className="p-4 bg-[#2a475e] rounded-b-lg">
        <p className="text-gray-300 text-sm mb-1">
          Platform: {review.platform}
        </p>
        <p className="text-gray-300 text-sm">
          Steam ID: {review.author_steamid}
        </p>
        <p className="text-gray-300 text-sm">
          Updated: {new Date(review.timestamp).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm">Votes Up: {review.votes_up}</p>
        <p className="text-gray-300 text-sm">
          Funny Votes: {review.votes_funny}
        </p>
        <p className="text-gray-300 text-sm">
          Weighted Score: {review.weighted_vote_score}
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Review: "{review.review_text}"
        </p>
        <p className="text-gray-300 text-sm">Sentiment: {review.sentiment}</p>
      </div>
    </div>
  );
}

export default SteamCard;
