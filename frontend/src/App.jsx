import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Function to fetch data from Solr
  const searchSolr = async () => {
    const solrUrl = "/solr/game_reviews/select";
    try {
      const response = await axios.get(solrUrl, {
        params: {
          q: query || "*:*", // default to match all if no query is provided
          rows: 10, // Limit to 10 results
        },
      });
      setResults(response.data.response.docs);
    } catch (error) {
      console.error("Error querying Solr:", error);
    }
  };

  // Fetch 10 results when the component mounts
  useEffect(() => {
    searchSolr(); // Run search when the component first loads
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={searchSolr}
          className="bg-blue-500 text-white px-4 py-2 w-full mb-4"
        >
          Search
        </button>
        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((doc, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Review by {doc.username[0]}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Platform: {doc.platform.join(", ")}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Review Type: {doc.review_type.join(", ")}
                </p>
                <p className="text-lg font-bold mb-2">Score: {doc.score[0]}</p>
                <p className="text-gray-700 mb-2">{doc.review[0]}</p>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
