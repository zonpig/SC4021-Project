import SentimentBadge from "./Sentiment";
function RedditCard({ review }) {
  const {
    Subreddit: subreddit,
    title,
    url,
    game,
    platform,
    Level: level, // Rename Level to level
    Score: score,
    sentiment,
    timestamp_updated_date: timestamp,
    review_text,
  } = review;
  return (
    <div className="rounded-lg w-full mx-auto bg-white shadow-lg">
      <div className=" bg-[#FF4500] text-white py-2 px-4 rounded-t-lg flex flex-row justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{game}</h2>
        </div>
        <div>
          <img
            src='/reddit.png'
            alt="Platform Logo"
            className="h-10 py-2 object-contain flex justify-end"
          />
        </div>
      </div>
      <div className="p-4 rounded-b-lg flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-sm font-bold">r/{subreddit}</p>
          </div>
          <div className="flex justify-end">
            <SentimentBadge sentiment={sentiment} />
          </div>
        </div>
        <div className="rounded-lg bg-gray-200 p-4 my-2">
          <div className="text-gray-800 text-sm">{review_text}</div>

          <div className="flex justify-end">
            <button
              className="mt-4 p-1 bg-gray-300  gap-2 rounded-lg hover:bg-[#D93A00] transition"
              onClick={() => window.open(url, "_blank")}
            >
              <div className = "flex flex-row gap-2 px-2 flex items-center justify-center">
              View Post
              <img src="link.png" alt="Open Logo" className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
              <p className="text-gray-600 text-sm">Level: {level}</p>
              <p className="text-gray-600 text-sm">Score: {score}</p>
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

export default RedditCard;


