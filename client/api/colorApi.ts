import axios from "axios";
import { backendApi } from "./BackendUri";

axios.defaults.withCredentials = true;
const API_URL = `${backendApi}api/v1/colors`;

export const colorApi = {
    // Add colors
    addColor: async ({ username, colorHex }: { username: string; colorHex: string[] }) => {
        const response = await axios.post(`${API_URL}/add-color`, { username, colorHex });
        return response.data;
    },

    // Get all color palettes
    getAllColorPalletes: async ({
        page,
        // limit = 10,
        userToken
    }: {
        page: number;
        // limit?: number;
        userToken?: string;
    }) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10'
        });
        // params.append("page", page.toString());
        // params.append("limit", limit.toString());

        if (userToken) {
            params.append('userToken', userToken);
        }

        const url = `${API_URL}/get-all-colors?${params}`;
        console.log("🌐 Fetching:", url); // Debug log


        // const response = await axios.get(`${API_URL}/get-all-colors?${params}`, {
        //     headers: userToken ? { "user-token": userToken } : {}
        // });

        const response = await fetch(url);
        

        // return {
        //     palettes: response.data.palettes,
        //     currentPage: response.data.currentPage,
        //     hasMore: response.data.currentPage < response.data.totalPages,
        //     totalPages: response.data.totalPages,
        //     totalPalettes: response.data.totalPalettes,
        //     count: response.data.count,
        // };

        if (!response.ok) throw new Error('Failed to fetch palettes');
        return response.json();
    },

    // Get color palette by ID
    getColorPaletteById: async (id: string, userToken?: string) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: userToken ? { "user-token": userToken } : {}
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Color Palette not found");
        }
    },

    // Get user liked color palettes
    likedColorPalettes: async (userToken?: string) => {
        try {
            const response = await axios.get(`${API_URL}/liked-color-palettes`, {
                headers: userToken ? { "user-token": userToken } : {}
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Unable to fetch Liked color palettes")
        }
    },

    // Like a color palette
    likeColorPalette: async ({ id, userToken }: { id: string; userToken: string }) => {
        const url = `${API_URL}/${id}/like?userToken=${encodeURIComponent(userToken)}`;
        console.log("❤️ Liking:", url); // Debug log
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to toggle like');
        return response.json();
    },
};
