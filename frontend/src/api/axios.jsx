import qs from "qs";
import axios from "axios";

export const api = axios.create({
  baseURL: "/solr/game_reviews",
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" }); // This ensures multiple `fq` params without brackets
  },
});

export const getGameReviews = async (
  query,
  rows = 10,
  start = 0,
  filters = {},
) => {
  console.log(query + " " + rows);
  const { platform, game, startDate, endDate } = filters;

  const params = {
    q: query || "*:*",
    rows: rows,
    start: start,
    fq: [
      platform && `platform:${platform}`, // Only this gets included
      game && `game:"${game}"`,
      startDate && !endDate && `timestamp:[${startDate} TO *]`, // Only startDate filter
      startDate && endDate && `timestamp:[${startDate} TO ${endDate}]`, // Combine startDate and endDate into a range query
    ].filter(Boolean),
    // ...(platform && { fq: `platform:${platform}` }),
    // ...(game && { fq: `game:${game}` }),
    // ...(startDate && { fq: `timestamp:[${startDate} TO *]` }),
    // ...(endDate && { fq: `timestamp:[* TO ${endDate}]` }),
  };

  const response = await api.get("/select", {
    params: params,
  });

  return response.data;
};
