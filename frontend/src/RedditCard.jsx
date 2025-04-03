function RedditCard() {
  const post = {
    level: 0,
    score: 5,
    subreddit: "DarkTide",
    title: "Weekly Discussion Thread - March 03, 2025",
    url: "https://www.reddit.com/r/DarkTide/comments/1j27slm/weekly_discussion_thread_march_03_2025/",
    game: "Warhammer 40k: Darktide",
    platform: "Reddit",
    sentiment: "neutral",
    timestamp: "2025-03-03T00:00:00Z",
    review_text:
      "When will this content drought end?\nStill going strong but we need something.\nGive us something FS.",
  };

  return (
    <div className="p-6 shadow-lg rounded-lg border border-gray-300 max-w-md mx-auto bg-white">
      <div className="bg-[#FF4500] text-white py-2 px-4 rounded-t-lg">
        <h2 className="text-xl font-bold">r/{post.subreddit}</h2>
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <p className="text-gray-600 text-sm mb-1">
          Game: <span className="font-semibold">{post.game}</span>
        </p>
        <p className="text-gray-600 text-sm">Platform: {post.platform}</p>
        <p className="text-gray-600 text-sm">
          Date: {new Date(post.timestamp).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">{post.title}</p>
        <p className="text-gray-600 text-sm">Level: {post.level}</p>
        <p className="text-gray-600 text-sm">Score: {post.score}</p>
        <p className="text-gray-600 text-sm">
          Review: &quot;{post.review_text}&quot;
        </p>
        <p className="text-gray-600 text-sm">Sentiment: {post.sentiment}</p>
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 bg-[#FF4500] text-white font-semibold hover:bg-[#D93A00] transition"
          onClick={() => window.open(post.url, "_blank")}
        >
          View Post
        </button>
      </div>
    </div>
  );
}

export default RedditCard;
