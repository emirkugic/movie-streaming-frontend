import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { moviesAPI } from "../services/api";

// Async thunks
export const fetchMovies = createAsyncThunk(
	"movies/fetchMovies",
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await moviesAPI.getAll(page);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchTrendingMovies = createAsyncThunk(
	"movies/fetchTrendingMovies",
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await moviesAPI.getTrending(page);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchUpcomingMovies = createAsyncThunk(
	"movies/fetchUpcomingMovies",
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await moviesAPI.getUpcoming(page);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchMovieDetails = createAsyncThunk(
	"movies/fetchMovieDetails",
	async (slug, { rejectWithValue }) => {
		try {
			const response = await moviesAPI.getMovie(slug);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Initial state
const initialState = {
	movies: [],
	trendingMovies: [],
	upcomingMovies: [],
	currentMovie: null,
	loading: false,
	error: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
	},
};

// Slice
const moviesSlice = createSlice({
	name: "movies",
	initialState,
	reducers: {
		clearMovieDetails: (state) => {
			state.currentMovie = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all movies
			.addCase(fetchMovies.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchMovies.fulfilled, (state, action) => {
				state.loading = false;
				state.movies = action.payload.data;
				state.pagination = {
					currentPage: action.payload.current_page,
					totalPages: action.payload.last_page,
					totalItems: action.payload.total,
				};
			})
			.addCase(fetchMovies.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch trending movies
			.addCase(fetchTrendingMovies.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTrendingMovies.fulfilled, (state, action) => {
				state.loading = false;
				state.trendingMovies = action.payload.data;
			})
			.addCase(fetchTrendingMovies.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch upcoming movies
			.addCase(fetchUpcomingMovies.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
				state.loading = false;
				state.upcomingMovies = action.payload.data;
			})
			.addCase(fetchUpcomingMovies.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch movie details
			.addCase(fetchMovieDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchMovieDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.currentMovie = action.payload;
			})
			.addCase(fetchMovieDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearMovieDetails } = moviesSlice.actions;
export default moviesSlice.reducer;
