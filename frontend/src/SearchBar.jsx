import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getGameReviews, performSpellCheck } from "./api/axios.jsx";

const SearchBar = ({
  activeTab,
  query,
  rows,
  start,
  filters,
  setQuery,
  setSearchResults,
  setSpellCheckResults,
}) => {
  const handleSubmit = async (e) => {
    console.log(query);
    e.preventDefault();
    try {
      const results = await getGameReviews(
        activeTab,
        query,
        rows,
        start,
        filters,
      );
      if (results.response.numFound < 15) {
        const suggestions = await performSpellCheck(query, (suggestion) =>
          setQuery(suggestion),
        );

        if (suggestions.length > 0) {
          setSpellCheckResults(suggestions);
        } else {
          setSpellCheckResults([]);
        }
      }

      console.log(results.response.docs);
      setSearchResults(results.response.docs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <header className="flex justify-center">
      <form
        className="p-6 rounded-lg  max-w-3xl w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row border border-gray-300 rounded-lg items-center bg-white shadow-lg">
          <input
            className="p-2 w-full focus: outline-none"
            type="text"
            id="search"
            value={query} // Bind the input field value to the query state
            onChange={handleSearchChange}
            placeholder="Search for games"
          />
          <button className="text-black px-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
    </header>
  );
};

export default SearchBar;
