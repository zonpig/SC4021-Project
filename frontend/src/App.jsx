import { useEffect, useState } from "react";
import { getGameReviews, performSpellCheck } from "./api/axios.jsx";
import SearchBar from "./SearchBar.jsx";
import RedditCard from "./RedditCard.jsx";
import SteamCard from "./SteamCard.jsx";
import MetacriticCard from "./MetacriticCard.jsx";
import SentimentPieChart from "./SentimentPieChart.jsx";
import SentimentBarChart from "./SentimentBarChart.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState(10);
  const [filters, setFilters] = useState({
    platform: "",
    game: "",
    sentiment: "",
    startDate: "",
    endDate: "",
    sort: "",
  });
  const [spellCheckResults, setSpellCheckResults] = useState([]);

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
  const [activeTab, setActiveTab] = useState("reviews"); // State for sidebar visibility
  const searchSolr = async (query, page, rows, filters) => {
    try {
      const data = await getGameReviews(
        activeTab,
        query,
        rows,
        page * rows,
        filters,
      );
      setSearchResults(data.response.docs);
      setTotalPages(Math.ceil(data.response.numFound / rows));
    } catch (error) {
      console.log(error);
    }
  };
  // this is for reviews tab
  useEffect(() => {
    setPage(0);

    const fetchData = async () => {
      try {
        const data = await getGameReviews(activeTab, query, rows, 0, filters);
        setSearchResults(data.response.docs);
        setTotalPages(Math.ceil(data.response.numFound / rows));

        if (data.response.docs.length < 15) {
          const suggestions = await performSpellCheck(query);
          if (suggestions.length > 0) {
            setSpellCheckResults(suggestions);
          } else {
            setSpellCheckResults([]);
          }
        } else {
          setSpellCheckResults([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [query, rows, filters]);

  useEffect(() => {
    searchSolr(query, page, rows, filters);
  }, [page]);
  // this is for charts tab
  useEffect(() => {
    // Trigger search when `activeTab` changes
    setPage(0); // Optionally reset page to 0 when the activeTab changes
    searchSolr(query, 0, rows, filters);
  }, [activeTab]); // Add `activeTab` as a dependency

  // display text in charts for user to know what the graph is about
  // Constructing the display text for the paragraph
  const getDisplayText = (chartType) => {
    let displayText =
      chartType === "pie"
        ? "Pie Chart displaying Sentiment Analysis"
        : "Bar Chart displaying Sentiment Analysis";

    const platformText = filters.platform
      ? `Across "${filters.platform}"`
      : "Across All Platforms";

    // displayText += ` across ${platformText}`;

    const gameText = filters.game ? `for "${filters.game}"` : ` for All Games`;
    // displayText += gameText

    const dateText =
      filters.startDate && filters.endDate
        ? ` starting from [${filters.startDate} to ${filters.endDate}]`
        : filters.startDate
          ? ` starting from [${filters.startDate}]`
          : "";
    // displayText += dateText;

    const sortText = filters.sort ? ` sorted by: ${filters.sort}` : "";
    // displayText += sortText

    return (
      <div className="space-x-2 p-8 flex items-center  flex-col">
        <p>{displayText}</p>
        <div className="flex flex-row space-x-1 text-xl font-bold">
          <p>{platformText}</p>
          <p>{gameText}</p>
          <p>{dateText}</p>
          <p>{sortText}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#f6eee3] via-[#ecfdf5] to-[#fbeff2]">
      <div className="">
        <h3 className={`text-3xl font-bold flex justify-center mt-20`}>
          Game Reviews
        </h3>{" "}
        <h3 className="text-wxl flex justify-center">
          Find Game Reviews from the Top 10 RPG Games currently!
        </h3>
        <SearchBar
          activeTab={activeTab}
          query={query}
          rows={rows}
          start={page * rows}
          filters={filters}
          setQuery={setQuery}
          setSearchResults={setSearchResults}
          setSpellCheckResults={setSpellCheckResults}
        />
      </div>

      <div className="flex flex-row w-full ">
        {/* Sidebar with toggle */}
        <div
          className={`w-1/4 p-4 mt-20 transition-all duration-300 ${sidebarVisible ? "block" : "hidden"}`}
        >
          <div className="sticky top-20 rounded-lg bg-white shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Filters</h3>
            {/* Platforms */}
            <div className="mb-2">
              <label className="block text-sm font-base">Platform</label>
              <select
                className="bg-gray-100 rounded p-1 w-full"
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
              <label className="block text-sm font-base">Game</label>
              <select
                className="bg-gray-100 rounded p-1 w-full"
                value={filters.game}
                onChange={(e) =>
                  setFilters({ ...filters, game: e.target.value })
                } // need to wrap the game because solr handles colon differently
              >
                <option value="">All</option>
                {gameOptions.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
            {/* Sentiment */}
            <div className="mb-2">
              <label className="block text-sm font-base">Sentiment</label>
              <select
                className="bg-gray-100 rounded p-1 w-full"
                value={filters.sentiment}
                onChange={(e) =>
                  setFilters({ ...filters, sentiment: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            {/* Start Date to End Date */}
            <div className="mb-2">
              <label className="block text-sm font-base">Start Date</label>
              <input
                type="date"
                className="bg-gray-100 rounded p-1 w-full"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-base">End Date</label>
              <input
                type="date"
                className="bg-gray-100 rounded p-1 w-full"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
            {/* Sort */}
            <div className="mb-2">
              <label className="block text-sm font-base">Sort By</label>
              <select
                className="bg-gray-100 rounded p-1 w-full"
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
          {/* display the hide filters button */}
          <div className="flex flex-row justify-between items-center mt-4">
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)} // Toggle sidebar visibility
              className=" p-2 bg-gray-200 text-black rounded-md"
            >
              {sidebarVisible ? "Hide Filters" : "Show Filters"}
            </button>
            {/* Tab Buttons */}
            <div className="flex space-x-0 mb-4">
              <button
                className={`px-4 py-2 rounded-l-lg ${
                  activeTab === "reviews"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`px-4 py-2 rounded-r-lg ${
                  activeTab === "charts"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("charts")}
              >
                Charts
              </button>
            </div>
          </div>
          {/* main body  */}
          <div className="">
            {activeTab === "reviews" ? (
              <div>
                <div className="space-y-4">
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

                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((review, index) => {
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
                      })}
                      <div className="flex justify-between mt-4">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                          onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 0))
                          }
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
                            setPage((prev) =>
                              Math.min(prev + 1, totalPages - 1),
                            );
                            // Scroll the page to the top
                            window.scrollTo(0, 0);
                          }}
                          disabled={page >= totalPages - 1}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : spellCheckResults.length > 0 ? (
                    <div className="text-red-500">
                      <p className="mb-2">Did you mean:</p>
                      <div className="flex flex-wrap gap-2">
                        {spellCheckResults.map((suggestion, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 bg-gray-200 hover:bg-blue-300 text-black rounded whitespace-nowrap"
                            onClick={() => setQuery(suggestion.word)} // triggers new search via `useEffect`
                          >
                            {suggestion.word} (Frequency: {suggestion.freq})
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>No results found</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="sm:w-1/3 md:w-1/2 lg:w-full">
                {/* Content for Charts */}
                {/* pie chart */}
                <div className="bg-white rounded-xl">
                  <div className="">{getDisplayText("pie")}</div>
                  <div className="flex justify-center items-center">
                    <SentimentPieChart solrData={searchResults} />
                  </div>
                </div>
                {/* bar chart */}
                <div className="bg-white rounded-xl mt-2">
                  <div className="">{getDisplayText("bar")}</div>
                  <div className="flex justify-center items-center w-full">
                    <SentimentBarChart solrData={searchResults ?? ""} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
