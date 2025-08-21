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
        page = 1,
        limit = 10,
    }: {
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const response = await axios.get(`${API_URL}/get-all-colors?${params.toString()}`);
        return {
            palettes: response.data.palettes,
            currentPage: response.data.currentPage,
            hasMore: response.data.currentPage < response.data.totalPages,
            totalPages: response.data.totalPages,
            totalPalettes: response.data.totalPalettes,
            count: response.data.count,
        };
    },

    // Get color palette by ID
    getColorPaletteById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Color Palette not found");
        }
    },

    // Like a color palette
    likeColorPalette: async ({ id, userToken }: { id: string; userToken: string }) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/like`, { userToken });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Unable to like this palette");
        }
    }
};
