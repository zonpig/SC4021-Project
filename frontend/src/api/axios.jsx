import axios from "axios";

export const api = axios.create({
  baseURL: "/solr/game_reviews",
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
    ...(platform && { fq: `platform:${platform}` }),
    ...(game && { fq: `game:${game}` }),
    ...(startDate && { fq: `timestamp:[${startDate} TO *]` }),
    ...(endDate && { fq: `timestamp:[* TO ${endDate}]` }),
  };

  const response = await api.get("/select", {
    params: params,
  });

  return response.data;
};
