import qs from "qs";
import axios from "axios";

export const api = axios.create({
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
  const { platform, game, startDate, endDate, sort } = filters;
  // if sort == "Ascnding" then sort by timestamp_updated_date asc
  // if sort == "Descending" then sort by timestamp_updated_date desc
  const sortValue = sort === "Ascending" 
  ? "timestamp_updated_date asc"  // If sort is "Ascending", use ascending sort
  : sort === "Descending"
    ? "timestamp_updated_date desc" // If sort is "Descending", use descending sort
    : ""; // If sort is neither "Ascending" nor "Descending", return an empty string

  let params = {}; 
  console.log(tab)

  
  if (tab == "charts"){
    // run this: curl "http://localhost:8983/solr/game_reviews/select?q=%2A%3A%2A&rows=0&start=0&sort="
    // to find how many rows, then edit accordingly in the rows param
    params = {
      q: query || "*:*",
      rows: 156964,
      start: 0,
      fq: [
        platform && `platform:${platform}`, // Only this gets included
        game && `game:"${game}"`,
        startDate && !endDate && `timestamp_updated_date:[${startDate}T00:00:00Z TO *]`, // solr requires the hhmmssZ to be included to filter
        startDate && endDate && `timestamp_updated_date:[${startDate}T00:00:00Z TO ${endDate}T00:00:00Z]`, // solr requires the hhmmssZ to be included to filter
      ].filter(Boolean),
      sort: sortValue && `${sortValue}`, // Sort by timestamp_updated_date
  
    };
  }
  else if (tab === "reviews"){
    params = {
      q: query || "*:*",
      rows: rows,
      start: start,
      fq: [
        platform && `platform:${platform}`, // Only this gets included
        game && `game:"${game}"`,
        startDate && !endDate && `timestamp_updated_date:[${startDate}T00:00:00Z TO *]`, // solr requires the hhmmssZ to be included to filter
        startDate && endDate && `timestamp_updated_date:[${startDate}T00:00:00Z TO ${endDate}T00:00:00Z]`, // solr requires the hhmmssZ to be included to filter
      ].filter(Boolean),
      sort: sortValue && `${sortValue}`, // Sort by timestamp_updated_date
  
    };
  }
  

  const response = await api.get("/select", {
    params: params,
  });

  return response.data;
};
