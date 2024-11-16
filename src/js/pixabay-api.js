import axios from 'axios';

const BASE_URL = 'https://pixabay.com';
const API_KEY = '46898279-65d5dcdd2fa29fc168f36b5dd';

export const fetchPhotos = async (query, page = 1) => {
    const urlParams = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
    };

    try {
        const response = await axios.get(`${BASE_URL}/api/`, { params: urlParams });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        throw error;
    }
};
