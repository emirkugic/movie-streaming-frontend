import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";

// Async thunks
export const registerUser = createAsyncThunk(
	"auth/register",
	async (userData, { rejectWithValue }) => {
		try {
			const response = await authAPI.register(userData);
			localStorage.setItem("token", response.data.token);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authAPI.login(credentials);
			localStorage.setItem("token", response.data.token);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await authAPI.logout();
			localStorage.removeItem("token");
			return null;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchCurrentUser = createAsyncThunk(
	"auth/fetchCurrentUser",
	async (_, { rejectWithValue }) => {
		try {
			const response = await authAPI.getUser();
			return response.data;
		} catch (error) {
			localStorage.removeItem("token");
			return rejectWithValue(error.response.data);
		}
	}
);

// Initial state
const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

// Slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Register cases
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Login cases
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Logout cases
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch user cases
			.addCase(fetchCurrentUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(fetchCurrentUser.rejected, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
			});
	},
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
