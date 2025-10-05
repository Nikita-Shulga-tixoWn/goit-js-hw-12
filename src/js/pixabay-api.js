import axios from "axios";

const API_KEY = "52616200-fc5cfd906759777ac22999e8c";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 15,
        page,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
}
