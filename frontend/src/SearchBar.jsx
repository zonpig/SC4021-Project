import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getGameReviews } from "./api/axios.jsx";

const SearchBar = ({ query, setQuery, setSearchResults }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const results = await getGameReviews(query);
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
    <header>
      <form
        className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full"
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-4"
          type="text"
          id="search"
          value={query} // Bind the input field value to the query state
          onChange={handleSearchChange}
          placeholder="Search for games"
        />
        <button className="bg-blue-500 text-white px-4 py-2 w-full mb-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    </header>
  );
};

export default SearchBar;
