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
  const [filters, setFilters] = useState({
    platform: "",
    game: "",
    startDate: "",
    endDate: "",
    sort: "",
  });

  const gameOptions = [
    "Warhammer 40k: Darktide", // exist but dont return
    "Battlefield 2042",
    "Cyberpunk 2077",
    "Days Gone",
    "Fallout 76",
    "Final Fantasy 14",
    "Sea of Thieves",
    "Total War: Rome 2", // cannot find
    "Wasteland 3",
    "Wildfrost",
  ];

  const [sidebarVisible, setSidebarVisible] = useState(true); // State for sidebar visibility

  const searchSolr = async (query, page, rows, filters) => {
    setLoading(true);
  
  
    try {
      const data = await getGameReviews(query, rows, page * rows, filters);
      setSearchResults(data.response.docs);
      setTotalPages(Math.ceil(data.response.numFound / rows));
    } catch (error) {
      console.log(error);
    }
  
    setLoading(false);
  };
  

  useEffect(() => {
    setPage(0);
    searchSolr(query, 0, rows, filters);
  }, [query, rows, filters]);

  useEffect(() => {
    searchSolr(query, page, rows, filters);
  }, [page]);

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className = "mt-20">
      <h3 className="text-3xl font-bold flex justify-center">Game Reviews</h3>
      <SearchBar
          query={query}
          setQuery={setQuery}
          setSearchResults={setSearchResults}
        />
        </div>
      <div className = "flex flex-row w-full">
      {/* Sidebar with toggle */}
      <div
        className={`w-1/4 p-4 mt-20 transition-all duration-300 ${sidebarVisible ? "block" : "hidden"}`}
      >
        <div className = "rounded-lg bg-white shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Filters</h3>
        {/* Platforms */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Platform</label>
          <select
            className="border rounded p-1 w-full"
            value={filters.platform}
            onChange={(e) =>
              setFilters({ ...filters, platform: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="Reddit">Reddit</option>
            <option value="Steam">Steam</option>
            <option value="Metacritic">Metacritic</option>
          </select>
        </div>
        {/* Games */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Game</label>
          <select
            className="border rounded p-1 w-full"
            value={filters.game}
            onChange={(e) => setFilters({ ...filters, game: e.target.value })} // need to wrap the game because solr handles colon differently
          >
            <option value="">All</option>
            {gameOptions.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>
        {/* Start Date to End Date */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="border rounded p-1 w-full"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="border rounded p-1 w-full"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>
        {/* Sort */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Sort By</label>
          <select
            className="border rounded p-1 w-full"
            value={filters.sort}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
        </div>
      </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 p-6 ${sidebarVisible ? "" : "mx-4"}`}>
        
        <div className="flex flex-row justify-between items-center py-4">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)} // Toggle sidebar visibility
            className=" p-2 bg-gray-200 text-black rounded-md"
          >
            {sidebarVisible ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="flex justify-end items-center">
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
        </div>

        <div className='space-y-4'>
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
            onClick={() => {
              setPage((prev) => Math.min(prev + 1, totalPages - 1));
              // Scroll the page to the top
              window.scrollTo(0, 0);
              
            }}
            
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
