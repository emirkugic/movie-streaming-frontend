import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchAPI } from "../services/api";

// Async thunks
export const searchContent = createAsyncThunk(
	"search/searchContent",
	async (query, { rejectWithValue }) => {
		try {
			if (!query || query.trim() === "") {
				return { movies: [], tv_shows: [] };
			}
			const response = await searchAPI.search(query);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Initial state
const initialState = {
	query: "",
	results: {
		movies: [],
		tvShows: [],
	},
	loading: false,
	error: null,
};

// Slice
const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		setSearchQuery: (state, action) => {
			state.query = action.payload;
		},
		clearSearchResults: (state) => {
			state.results = { movies: [], tvShows: [] };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(searchContent.pending, (state) => {
				state.loading = true;
			})
			.addCase(searchContent.fulfilled, (state, action) => {
				state.loading = false;
				state.results = {
					movies: action.payload.movies || [],
					tvShows: action.payload.tv_shows || [],
				};
			})
			.addCase(searchContent.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { setSearchQuery, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
