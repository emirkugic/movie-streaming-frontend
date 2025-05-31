import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moviesReducer from "./moviesSlice";
import tvShowsReducer from "./tvShowsSlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		movies: moviesReducer,
		tvShows: tvShowsReducer,
		search: searchReducer,
		user: userReducer,
	},
});

export default store;
