import React from "react";

export default function SentimentBadge({ sentiment }) {
    // console.log("SENTIMENT VALUE:", sentiment);
    // console.log("TYPE OF SENTIMENT:", typeof sentiment);
    const sentimentValue = Array.isArray(sentiment) ? sentiment[0] : "";  // Fallback to sentiment if sentimentValue is undefined
    // console.log("SENTIMENT VALUE AFTER FALLBACK:", sentimentValue);
    // console.log("TYPE OF SENTIMENT AFTER FALLBACK:", typeof sentimentValue);

  const getSentimentBgColor = (sentimentValue) => {
    // const normalizedSentiment = sentiment.toLowerCase(); // normalize it first!

    if (sentimentValue === "positive") {
      return "bg-green-100 text-green-800";
    } else if (sentimentValue === "negative") {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800"; // Neutral (or fallback)
    }
  };

  return (
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSentimentBgColor(sentimentValue)}`}>
      {sentimentValue.charAt(0).toUpperCase() + sentimentValue.slice(1)}
    </div>

      
  );
}
