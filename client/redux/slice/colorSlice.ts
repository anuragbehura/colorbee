import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

// Base API URL
const API_URL = "http://localhost:3001/api/colors";

// Define types
interface ColorPalette {
    id: string;
    name: string;
    colors: string[]; // Array of hex color codes
    likes: number;
}

interface ColorPalettesState {
    palettes: ColorPalette[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: ColorPalettesState = {
    palettes: [],
    loading: false,
    error: null,
};

// Fetch Color Palettes
export const fetchColorPalettes = createAsyncThunk<ColorPalette[], void, { rejectValue: { message: string } }>(
    "colorPalettes/fetchColorPalettes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<ColorPalette[]>(API_URL);
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

// Like a color palette
export const likeColorPalette = createAsyncThunk<ColorPalette, string, { rejectValue: { message: string } }>(
    "colorPalettes/likeColorPalette",
    async (paletteId, { rejectWithValue }) => {
        try {
            const response = await axios.post<ColorPalette>(`${API_URL}/${paletteId}/like`, {});
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : { message: "Failed to like color palette" }
            );
        }
    }
);

const colorPalettesSlice = createSlice({
    name: "colorPalettes",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchColorPalettes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchColorPalettes.fulfilled, (state, action: PayloadAction<ColorPalette[]>) => {
            state.palettes = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchColorPalettes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "An error occurred";
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

        builder.addCase(likeColorPalette.fulfilled, (state, action: PayloadAction<ColorPalette>) => {
            const palette = state.palettes.find((p) => p.id === action.payload.id);
            if (palette) {
                palette.likes = action.payload.likes;
            }
        });
        builder.addCase(likeColorPalette.rejected, (state, action) => {
            state.error = action.payload?.message || "An error occurred";
        });
    },
});

export const { clearError } = colorPalettesSlice.actions;
export default colorPalettesSlice.reducer;
