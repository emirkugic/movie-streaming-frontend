import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import TvShowPage from "./pages/TvShowPage";
import EpisodePage from "./pages/EpisodePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Auth
import PrivateRoute from "./components/auth/PrivateRoute";

// Styles
import "./assets/styles/App.scss";

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
								<div>Profile Page (To be implemented)</div>
							</PrivateRoute>
						}
					/>
					<Route
						path="/watchlist"
						element={
							<PrivateRoute>
								<div>Watchlist Page (To be implemented)</div>
							</PrivateRoute>
						}
					/>
					<Route
						path="/favorites"
						element={
							<PrivateRoute>
								<div>Favorites Page (To be implemented)</div>
							</PrivateRoute>
						}
					/>
					<Route
						path="/watch-history"
						element={
							<PrivateRoute>
								<div>Watch History Page (To be implemented)</div>
							</PrivateRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
