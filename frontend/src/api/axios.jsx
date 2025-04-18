import qs from "qs";
import axios from "axios";

const api = axios.create({
  baseURL: "/solr/game_reviews",
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" }); // This ensures multiple `fq` params without brackets
  },
});

export const getGameReviews = async (
  tab,
  query,
  rows = 10,
  start = 0,
  filters = {},
) => {
  console.log(query + " " + rows);
  const { platform, game, sentiment, startDate, endDate, sort } = filters;
  // if sort == "Ascnding" then sort by timestamp_updated_date asc
  // if sort == "Descending" then sort by timestamp_updated_date desc
  const sortValue =
    sort === "Ascending"
      ? "timestamp_updated_date asc" // If sort is "Ascending", use ascending sort
      : sort === "Descending"
        ? "timestamp_updated_date desc" // If sort is "Descending", use descending sort
        : ""; // If sort is neither "Ascending" nor "Descending", return an empty string

  let params = {};
  console.log(tab);

  if (tab == "charts") {
    // run this: curl "http://localhost:8983/solr/game_reviews/select?q=%2A%3A%2A&rows=0&start=0&sort="
    // to find how many rows, then edit accordingly in the rows param
    params = {
      q: query || "*:*",
      rows: 156964,
      start: 0,
      fq: [
        platform && `platform:${platform}`, // Only this gets included
        game && `game:"${game}"`,
        sentiment && `sentiment:"${sentiment}"`,
        startDate &&
          !endDate &&
          `timestamp_updated_date:[${startDate}T00:00:00Z TO *]`, // solr requires the hhmmssZ to be included to filter
        startDate &&
          endDate &&
          `timestamp_updated_date:[${startDate}T00:00:00Z TO ${endDate}T00:00:00Z]`, // solr requires the hhmmssZ to be included to filter
      ].filter(Boolean),
      sort: sortValue && `${sortValue}`, // Sort by timestamp_updated_date
    };
  } else if (tab === "reviews") {
    params = {
      q: query ? `review_text:${query} OR review_text_unstem:${query}` : "*:*",
      rows: rows,
      start: start,
      fq: [
        platform && `platform:${platform}`, // Only this gets included
        game && `game:"${game}"`,
        sentiment && `sentiment:"${sentiment}"`,
        startDate &&
          !endDate &&
          `timestamp_updated_date:[${startDate}T00:00:00Z TO *]`, // solr requires the hhmmssZ to be included to filter
        startDate &&
          endDate &&
          `timestamp_updated_date:[${startDate}T00:00:00Z TO ${endDate}T00:00:00Z]`, // solr requires the hhmmssZ to be included to filter
      ].filter(Boolean),
      sort: sortValue && `${sortValue}`, // Sort by timestamp_updated_date
    };
  }

  const response = await api.get("/select", {
    params: params,
  });

  return response.data;
};

export const performSpellCheck = async (query) => {
  console.log("Performing spell check for query:", query);
  const params = {
    q: query,
    spellcheck: true,
    wt: "json",
  };

  try {
    const response = await api.get("/spell", { params });

    if (response.status === 200) {
      const data = response.data; // Use .data instead of .json() in axios

      console.log("Spellcheck data:", data);

      const suggestions = data?.spellcheck?.suggestions;

      // Check if there are suggestions
      if (suggestions && suggestions.length > 1) {
        const suggestionBlock = suggestions[1]; // usually index 1 holds suggestions

        console.log("Suggestion block:", suggestionBlock);

        const suggestionList = suggestionBlock?.suggestion;
        if (Array.isArray(suggestionList) && suggestionList.length > 0) {
          // Sort by frequency (descending)
          suggestionList.sort((a, b) => b.freq - a.freq);

          // Take top 5 suggestions
          return suggestionList.slice(0, 6);
        }
      }
    } else {
      console.error(`Spellcheck failed. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Spellcheck error:", error);
  }

  return []; // Return empty array if no suggestions or error
};
