import React from "react";
import SentimentBadge from "./Sentiment";

function SteamCard({ review }) {
  // const review = {
  //   author_steamid: "76561199124653300",
  //   game: "Cyberpunk 2077",
  //   platform: "Steam",
  //   review_text:
  //     "This is going to be Oakland through Hayward, CA in about 4 years",
  //   sentiment: "negative",
  //   timestamp: "2025-02-13T00:00:00Z",
  //   votes_funny: 0,
  //   votes_up: 0,
  //   weighted_vote_score: 0.5,
  // };
  const {
    author_steamid,
    game,
    platform,
    review_text,
    sentiment,
    timestamp_updated_date: timestamp,
    votes_funny,
    votes_up,
    weighted_vote_score,
  } = review;

  return (
    <div className="shadow-lg rounded-lg w-full mx-auto bg-gray-100">
      {/* game name and platform logo */}
      <div className="text-white bg-[#2a475e] text-white py-2 px-4 rounded-t-lg flex flex-row justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{game}</h2>
        </div>
        <div>
          <img
            src='/steam.png'  
            alt="Platform Logo"
            className="h-10 py-2 object-contain flex justify-end"
          />
        </div>
      </div>
      {/* review details */}
      <div className="p-4 rounded-b-lg flex flex-col bg-white">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-sm font-bold">
            ID: {String(author_steamid).replace('.', '').split('e+')[0]}
            </p>
          </div>
          <div className="flex justify-end">
            <SentimentBadge sentiment={sentiment} />
          </div>
        </div>
        {/* review text */}
        <div className="rounded-lg bg-gray-200 p-4 my-2">
          <p className="text-gray-800 text-sm">{review_text}</p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
            <p className="text-gray-600 text-sm">Votes Up: {votes_up}</p>
        <p className="text-gray-600 text-sm">Funny Votes: {votes_funny}</p>
        <p className="text-gray-600 text-sm">
        Weighted Score: {Number(weighted_vote_score).toFixed(2)}
        </p>
            </div>
            <div className="text-gray-500 text-sm flex justify-end">
              Updated: {new Date(timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SteamCard;
