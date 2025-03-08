import {useEffect, useState} from "react";
import {getGameReviews} from "./api/axios.jsx";
import SearchBar from "./SearchBar.jsx";

function App() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    let rows = 10;

    // Function to fetch data from Solr
    const searchSolr = async (query, rows) => {
        try {
            const data = await getGameReviews(query, rows);
            setSearchResults(data.response.docs);
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch 10 results when the component mounts
    useEffect(() => {
        searchSolr(query, rows); // Run search when the component first loads
    }, []); // Empty dependency array means this effect runs once after initial render


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                <SearchBar query={query} setQuery={setQuery} setSearchResults={setSearchResults}/>
                <div className="space-y-4">
                    {searchResults.length > 0 ? (
                        searchResults.map((doc, index) => (
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
