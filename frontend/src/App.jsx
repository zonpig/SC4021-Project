import { useEffect, useState } from "react";
import { getGameReviews } from "./api/axios.jsx";
import SearchBar from "./SearchBar.jsx";
import RedditCard from "./RedditCard.jsx";
import SteamCard from "./SteamCard.jsx";
import MetacriticCard from "./MetacriticCard.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(10);

  const searchSolr = async (query, page, rows) => {
    setLoading(true);
    try {
      const data = await getGameReviews(query, rows, page * rows);
      setSearchResults(data.response.docs);
      setTotalPages(Math.ceil(data.response.numFound / rows));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(0);
    searchSolr(query, 0, rows);
  }, [query, rows]);

  useEffect(() => {
    searchSolr(query, page, rows);
  }, [page]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <SearchBar
          query={query}
          setQuery={setQuery}
          setSearchResults={setSearchResults}
        />
        <div className="flex justify-end mb-4">
          <label className="mr-2">Results per page:</label>
          <select
            className="border rounded p-1"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="mt-4 space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((review, index) => {
              const CardComponent = review.platform.includes("Reddit")
                ? RedditCard
                : review.platform.includes("Steam")
                  ? SteamCard
                  : review.platform.includes("Metacritic")
                    ? MetacriticCard
                    : null;

              return CardComponent ? (
                <div key={index}>
                  <CardComponent review={review} />
                </div>
              ) : null;
            })
          ) : (
            <p>No results found</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <p>
            Page {page + 1} of {totalPages}
          </p>
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
