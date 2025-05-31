import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tvShowsAPI } from "../services/api";

// Async thunks
export const fetchTvShows = createAsyncThunk(
	"tvShows/fetchTvShows",
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await tvShowsAPI.getAll(page);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchTrendingTvShows = createAsyncThunk(
	"tvShows/fetchTrendingTvShows",
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await tvShowsAPI.getTrending(page);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchTvShowDetails = createAsyncThunk(
	"tvShows/fetchTvShowDetails",
	async (slug, { rejectWithValue }) => {
		try {
			const response = await tvShowsAPI.getTvShow(slug);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchSeasonDetails = createAsyncThunk(
	"tvShows/fetchSeasonDetails",
	async ({ slug, seasonNumber }, { rejectWithValue }) => {
		try {
			const response = await tvShowsAPI.getSeason(slug, seasonNumber);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchEpisodeDetails = createAsyncThunk(
	"tvShows/fetchEpisodeDetails",
	async ({ slug, seasonNumber, episodeNumber }, { rejectWithValue }) => {
		try {
			const response = await tvShowsAPI.getEpisode(
				slug,
				seasonNumber,
				episodeNumber
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Initial state
const initialState = {
	tvShows: [],
	trendingTvShows: [],
	currentTvShow: null,
	currentSeason: null,
	currentEpisode: null,
	loading: false,
	error: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
	},
};

// Slice
const tvShowsSlice = createSlice({
	name: "tvShows",
	initialState,
	reducers: {
		clearTvShowDetails: (state) => {
			state.currentTvShow = null;
			state.currentSeason = null;
			state.currentEpisode = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all TV shows
			.addCase(fetchTvShows.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTvShows.fulfilled, (state, action) => {
				state.loading = false;
				state.tvShows = action.payload.data;
				state.pagination = {
					currentPage: action.payload.current_page,
					totalPages: action.payload.last_page,
					totalItems: action.payload.total,
				};
			})
			.addCase(fetchTvShows.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch trending TV shows
			.addCase(fetchTrendingTvShows.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTrendingTvShows.fulfilled, (state, action) => {
				state.loading = false;
				state.trendingTvShows = action.payload.data;
			})
			.addCase(fetchTrendingTvShows.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch TV show details
			.addCase(fetchTvShowDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTvShowDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.currentTvShow = action.payload;
			})
			.addCase(fetchTvShowDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch season details
			.addCase(fetchSeasonDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchSeasonDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.currentSeason = action.payload;
			})
			.addCase(fetchSeasonDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch episode details
			.addCase(fetchEpisodeDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchEpisodeDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.currentEpisode = action.payload;
			})
			.addCase(fetchEpisodeDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearTvShowDetails } = tvShowsSlice.actions;
export default tvShowsSlice.reducer;
