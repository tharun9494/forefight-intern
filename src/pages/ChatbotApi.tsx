import axios from 'axios';

const API_KEY = 'AIzaSyCiW-pa1UCDGcfUo4iwPM_nihoufcUUukE'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEY}`;

export const fetchGeminiResponse = async (prompt) => {
    try {
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.data.candidates[0].content;
    } catch (error) {
        console.error('Error fetching Gemini API:', error);
        return 'Error: Unable to fetch response';
    }
};