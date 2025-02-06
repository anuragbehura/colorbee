import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

// Base API URL
const API_URL = "http://localhost:3001/api/colors";

// Define types
interface ColorPalette {
    id: string;
    username: string,
    colors: string[]; // Array of hex color codes
    createdAt: string;
    likes: number;
    isLiked: boolean;
}

interface PaginatedResponse {
    message: string;
    count: number;
    totalPalettes: number;
    currentPage: number;
    totalPages: number;
    palettes: ColorPalette[];
}

interface ColorPalettesState {
    palettes: ColorPalette[];
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: ColorPalettesState = {
    palettes: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
};

// Fetch Color Palettes
export const fetchColorPalettes = createAsyncThunk<
PaginatedResponse,
    { page: number; limit: number; userToken: string },
    { rejectValue: { message: string } }
    > (
        "colorPalettes/fetchColorPalettes",
        async ({ page, limit, userToken }, { rejectWithValue }) => {
            try {
                const response = await axios.get<PaginatedResponse>(
                    `${API_URL}/get-all-colors?page=${page}&limit=${limit}&userToken=${userToken}`,
                    { withCredentials: true }
                );
                return response.data;
            } catch (error: unknown) {
                return rejectWithValue(
                    axios.isAxiosError(error) && error.response?.data
                        ? error.response.data
                        : { message: "Failed to fetch color palettes" }
                );
            }
        }
    );


// Add a new color palette
export const addColorPalette = createAsyncThunk<ColorPalette, Omit<ColorPalette, "id">, { rejectValue: { message: string } }>(
    "colorPalettes/addColorPalette",
    async (paletteData, { rejectWithValue }) => {
        try {
            const response = await axios.post<ColorPalette>(`${API_URL}/add-color`, paletteData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : { message: "Failed to add color palette" }
            );
        }
    }
);

// Modify the likeColorPalette thunk
export const likeColorPalette = createAsyncThunk<
ColorPalette,
    { paletteId: string; userToken: string },
    { rejectValue: { message: string } }
    > (
        "colorPalettes/likeColorPalette",
        async ({ paletteId, userToken }, { rejectWithValue, dispatch }) => {
            try {
                // Optimistic update before API call
                dispatch(likeColorPaletteOptimistic({ id: paletteId }));

                const response = await axios.post<ColorPalette>(
                    `${API_URL}/${paletteId}/like`,
                    { userToken }
                );
                return response.data;
            } catch (error: unknown) {
                // Revert optimistic update on error
                dispatch(likeColorPaletteOptimistic({ id: paletteId }));
                return rejectWithValue(
                    axios.isAxiosError(error) && error.response?.data
                        ? error.response.data
                        : { message: "Failed to update like status" }
                );
            }
        }
    );

export const fetchColorPaletteById = createAsyncThunk<ColorPalette, string>(
    "colorPalettes/fetchColorPaletteById",
    async (paletteId) => {
        const response = await axios.get<ColorPalette>(`${API_URL}/${paletteId}`);
        return response.data;
    }
);

// Create slice with reducer for optimistic update
const colorPalettesSlice = createSlice({
    name: "colorPalettes",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Handling optimistic like update
        likeColorPaletteOptimistic: (state, action: PayloadAction<{ id: string }>) => {
            const palette = state.palettes.find((p) => p.id === action.payload.id);
            if (palette) {
                palette.isLiked = !palette.isLiked;
                palette.likes += palette.isLiked ? 1 : -1;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchColorPalettes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchColorPalettes.fulfilled, (state, action) => {
            state.palettes = action.payload.palettes;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            console.log(state.palettes);
            state.loading = false;
        });
        builder.addCase(fetchColorPalettes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "An error occurred";
        });

        builder.addCase(fetchColorPaletteById.fulfilled, (state, action: PayloadAction<ColorPalette>) => {
            const palette = state.palettes.find((p) => p.id === action.payload.id);
            if (palette) {
                palette.likes = action.payload.likes;
                palette.isLiked = action.payload.isLiked;
            }
        });

        builder.addCase(addColorPalette.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addColorPalette.fulfilled, (state, action: PayloadAction<ColorPalette>) => {
            state.palettes.push(action.payload);
            state.loading = false;
        });
        builder.addCase(addColorPalette.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "An error occurred";
        });

        builder.addCase(likeColorPalette.fulfilled, (state, action) => {
            const palette = state.palettes.find((p) => p.id === action.payload.id);
            if (palette) {
                palette.likes = action.payload.likes;
                palette.isLiked = action.payload.isLiked;
            }
        });
        builder.addCase(likeColorPalette.rejected, (state, action) => {
            state.error = action.payload?.message || "An error occurred";
        });
    },
});

export const { clearError, likeColorPaletteOptimistic } = colorPalettesSlice.actions;
export default colorPalettesSlice.reducer;
