import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { watchlistAPI, favoritesAPI, watchHistoryAPI } from "../services/api";

// Async thunks for watchlist
export const fetchWatchlist = createAsyncThunk(
	"user/fetchWatchlist",
	async (_, { rejectWithValue }) => {
		try {
			const response = await watchlistAPI.getWatchlist();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const addToWatchlist = createAsyncThunk(
	"user/addToWatchlist",
	async ({ type, id }, { rejectWithValue }) => {
		try {
			const response = await watchlistAPI.addToWatchlist(type, id);
			return { type, id, data: response.data };
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const removeFromWatchlist = createAsyncThunk(
	"user/removeFromWatchlist",
	async ({ type, id }, { rejectWithValue }) => {
		try {
			await watchlistAPI.removeFromWatchlist(type, id);
			return { type, id };
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Async thunks for favorites
export const fetchFavorites = createAsyncThunk(
	"user/fetchFavorites",
	async (_, { rejectWithValue }) => {
		try {
			const response = await favoritesAPI.getFavorites();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const addToFavorites = createAsyncThunk(
	"user/addToFavorites",
	async ({ type, id }, { rejectWithValue }) => {
		try {
			const response = await favoritesAPI.addToFavorites(type, id);
			return { type, id, data: response.data };
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const removeFromFavorites = createAsyncThunk(
	"user/removeFromFavorites",
	async ({ type, id }, { rejectWithValue }) => {
		try {
			await favoritesAPI.removeFromFavorites(type, id);
			return { type, id };
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Async thunks for watch history
export const fetchWatchHistory = createAsyncThunk(
	"user/fetchWatchHistory",
	async (_, { rejectWithValue }) => {
		try {
			const response = await watchHistoryAPI.getWatchHistory();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const updateWatchProgress = createAsyncThunk(
	"user/updateWatchProgress",
	async ({ type, id, progress, completed }, { rejectWithValue }) => {
		try {
			const response = await watchHistoryAPI.updateWatchHistory(
				type,
				id,
				progress,
				completed
			);
			return { type, id, progress, completed, data: response.data };
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Initial state
const initialState = {
	watchlist: {
		movies: [],
		tvShows: [],
		loading: false,
		error: null,
	},
	favorites: {
		movies: [],
		tvShows: [],
		loading: false,
		error: null,
	},
	watchHistory: {
		movies: [],
		episodes: [],
		loading: false,
		error: null,
	},
};

// Slice
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearUserData: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			// Watchlist cases
			.addCase(fetchWatchlist.pending, (state) => {
				state.watchlist.loading = true;
			})
			.addCase(fetchWatchlist.fulfilled, (state, action) => {
				state.watchlist.loading = false;
				state.watchlist.movies = action.payload.movies || [];
				state.watchlist.tvShows = action.payload.tv_shows || [];
			})
			.addCase(fetchWatchlist.rejected, (state, action) => {
				state.watchlist.loading = false;
				state.watchlist.error = action.payload;
			})
			// Favorites cases
			.addCase(fetchFavorites.pending, (state) => {
				state.favorites.loading = true;
			})
			.addCase(fetchFavorites.fulfilled, (state, action) => {
				state.favorites.loading = false;
				state.favorites.movies = action.payload.movies || [];
				state.favorites.tvShows = action.payload.tv_shows || [];
			})
			.addCase(fetchFavorites.rejected, (state, action) => {
				state.favorites.loading = false;
				state.favorites.error = action.payload;
			})
			// Watch history cases
			.addCase(fetchWatchHistory.pending, (state) => {
				state.watchHistory.loading = true;
			})
			.addCase(fetchWatchHistory.fulfilled, (state, action) => {
				state.watchHistory.loading = false;
				state.watchHistory.movies = action.payload.movies || [];
				state.watchHistory.episodes = action.payload.episodes || [];
			})
			.addCase(fetchWatchHistory.rejected, (state, action) => {
				state.watchHistory.loading = false;
				state.watchHistory.error = action.payload;
			});
	},
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
