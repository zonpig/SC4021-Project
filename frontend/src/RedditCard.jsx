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
    <div className="p-6 shadow-lg rounded-lg border border-gray-300  mx-auto bg-white max-w-3xl w-full">
      <div className="bg-[#FF4500] text-white py-2 px-4 rounded-t-lg">
        <h2 className="text-xl font-bold">r/{subreddit}</h2>
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <p className="text-gray-600 text-sm mb-1">
          Game: <span className="font-semibold">{game}</span>
        </p>
        <p className="text-gray-600 text-sm">Platform: {platform}</p>
        <p className="text-gray-600 text-sm">
          Date: {new Date(timestamp).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-gray-600 text-sm">Level: {level}</p>
        <p className="text-gray-600 text-sm">Score: {score}</p>
        <p className="text-gray-600 text-sm">
          Review: &quot;{review_text}&quot;
        </p>
        <p className="text-gray-600 text-sm">Sentiment: {sentiment}</p>
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 bg-[#FF4500] text-white font-semibold hover:bg-[#D93A00] transition"
          onClick={() => window.open(url, "_blank")}
        >
          View Post
        </button>
      </div>
    </div>
  );
}

export default RedditCard;
