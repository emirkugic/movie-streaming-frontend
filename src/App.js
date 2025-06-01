// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";

// Layouts
import MainLayout from "./layouts/MainLayout/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import TvShowPage from "./pages/TvShowPage";
import EpisodePage from "./pages/EpisodePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
// import WatchlistPage from "./pages/WatchlistPage";
// import FavoritesPage from "./pages/FavoritesPage";
// import WatchHistoryPage from "./pages/WatchHistoryPage";
// import NotFoundPage from "./pages/NotFoundPage";

// Auth
import PrivateRoute from "./components/auth/PrivateRoute";

// Styles
import "./assets/styles/index.scss";

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			dispatch(fetchCurrentUser());
		}
	}, [dispatch]);

	return (
		<BrowserRouter>
			<Routes>
				{/* Main routes with layout */}
				<Route path="/" element={<MainLayout />}>
					{/* Public routes */}
					<Route index element={<HomePage />} />
					<Route path="/movies/:slug" element={<MoviePage />} />
					<Route path="/tv-shows/:slug" element={<TvShowPage />} />
					<Route
						path="/tv-shows/:slug/s:seasonNumber/e:episodeNumber"
						element={<EpisodePage />}
					/>
					<Route path="/search" element={<SearchPage />} />
					{/* Auth routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					{/* Protected routes */}
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<ProfilePage />
							</PrivateRoute>
						}
					/>
					{/* <Route
						path="/watchlist"
						element={
							<PrivateRoute>
								<WatchlistPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/favorites"
						element={
							<PrivateRoute>
								<FavoritesPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/watch-history"
						element={
							<PrivateRoute>
								<WatchHistoryPage />
							</PrivateRoute>
						}
					/>

					{/* <Route path="*" element={<NotFoundPage />} /> */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
