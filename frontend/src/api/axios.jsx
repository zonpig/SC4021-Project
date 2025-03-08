import axios from "axios"

export const api = axios.create({
    baseURL: '/solr/game_reviews'
})

export const getGameReviews = async (query, rows = 10) => {
    console.log(query + " " + rows);
    const response = await api.get('/select', {
        params: {
            q: query || "*:*",
            rows: rows,
        },
    });
    return response.data;
}