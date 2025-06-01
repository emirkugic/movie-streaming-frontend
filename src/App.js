// src/App.js - Fixed with correct route parameters
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Simple error boundary component
const ErrorBoundary = ({ children }) => {
	const [hasError, setHasError] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		const handleError = (error) => {
			console.error("Route Error:", error);
			setHasError(true);
			setError(error);
		};

		window.addEventListener("error", handleError);

		return () => {
			window.removeEventListener("error", handleError);
		};
	}, []);

	if (hasError) {
		return (
			<div style={{ padding: "2rem", textAlign: "center" }}>
				<h1>Something went wrong</h1>
				<p>We're sorry, but there was an error loading this page.</p>
				<pre
					style={{
						textAlign: "left",
						background: "#f1f1f1",
						padding: "1rem",
						overflow: "auto",
						maxHeight: "200px",
					}}
				>
					{error?.toString() || "Unknown error"}
				</pre>
				<button
					onClick={() => (window.location.href = "/")}
					style={{
						background: "#e50914",
						color: "white",
						border: "none",
						padding: "0.5rem 1rem",
						borderRadius: "4px",
						marginTop: "1rem",
						cursor: "pointer",
					}}
				>
					Return to Home
				</button>
			</div>
		);
	}

	return children;
};

// Fallback component for routes that fail to load
const FallbackRoute = () => {
	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h1>Page Not Found</h1>
			<p>We couldn't find the page you're looking for.</p>
			<button
				onClick={() => (window.location.href = "/")}
				style={{
					background: "#e50914",
					color: "white",
					border: "none",
					padding: "0.5rem 1rem",
					borderRadius: "4px",
					marginTop: "1rem",
					cursor: "pointer",
				}}
			>
				Return to Home
			</button>
		</div>
	);
};

// Simple episode player component as a fallback
const DirectEpisodePlayer = () => {
	// Get the URL parts
	const pathParts = window.location.pathname.split("/");
	const slug = pathParts[2]; // e.g., "breaking-bad-1396"
	const seasonPart = pathParts[3]; // e.g., "s1"
	const episodePart = pathParts[4]; // e.g., "e1"

	// Extract ID from slug
	const idMatch = slug.match(/.*-(\d+)/);
	const showId = idMatch ? idMatch[1] : null;

	// Extract season and episode numbers
	const seasonNum = seasonPart ? parseInt(seasonPart.replace("s", ""), 10) : 1;
	const episodeNum = episodePart
		? parseInt(episodePart.replace("e", ""), 10)
		: 1;

	// Get show name from slug
	const showName = slug
		.replace(/-\d+$/, "") // Remove the ID part
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<div style={{ padding: "1rem" }}>
			<div style={{ marginBottom: "1rem" }}>
				<a
					href={`/tv-shows/${slug}`}
					style={{
						display: "inline-flex",
						alignItems: "center",
						color: "white",
						textDecoration: "none",
						padding: "0.5rem 1rem",
						background: "rgba(255,255,255,0.2)",
						borderRadius: "4px",
					}}
				>
					← Back to {showName}
				</a>
			</div>

			<h1 style={{ marginBottom: "1rem" }}>
				{showName} - Season {seasonNum}, Episode {episodeNum}
			</h1>

			<div
				style={{
					position: "relative",
					paddingBottom: "56.25%",
					height: 0,
					overflow: "hidden",
					marginBottom: "1rem",
				}}
			>
				<iframe
					src={`https://vidsrc.xyz/embed/tv/${showId}/${seasonNum}-${episodeNum}`}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						border: "none",
					}}
					allowFullScreen
					title={`${showName} S${seasonNum}E${episodeNum}`}
				></iframe>
			</div>

			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{episodeNum > 1 && (
					<a
						href={`/tv-shows/${slug}/s${seasonNum}/e${episodeNum - 1}`}
						style={{
							display: "inline-flex",
							alignItems: "center",
							color: "white",
							textDecoration: "none",
							padding: "0.5rem 1rem",
							background: "rgba(255,255,255,0.2)",
							borderRadius: "4px",
						}}
					>
						← Previous Episode
					</a>
				)}

				<a
					href={`/tv-shows/${slug}/s${seasonNum}/e${episodeNum + 1}`}
					style={{
						display: "inline-flex",
						alignItems: "center",
						color: "white",
						textDecoration: "none",
						padding: "0.5rem 1rem",
						background: "rgba(255,255,255,0.2)",
						borderRadius: "4px",
						marginLeft: "auto",
					}}
				>
					Next Episode →
				</a>
			</div>
		</div>
	);
};

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
			<ErrorBoundary>
				<Routes>
					{/* Main routes with layout */}
					<Route path="/" element={<MainLayout />}>
						{/* Public routes */}
						<Route index element={<HomePage />} />
						<Route path="/movies/:slug" element={<MoviePage />} />
						<Route path="/tv-shows/:slug" element={<TvShowPage />} />

						{/* FIXED: Changed the route pattern for episodes */}
						<Route
							path="/tv-shows/:slug/s:seasonNumber/e:episodeNumber"
							element={<EpisodePage />}
						/>

						{/* Alternative episode route in case the above doesn't work */}
						<Route
							path="/tv-shows/:slug/:seasonParam/:episodeParam"
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

						{/* Catch-all route */}
						<Route path="*" element={<FallbackRoute />} />
					</Route>

					{/* Direct episode player route as fallback */}
					<Route
						path="/tv-shows/:slug/s:seasonNumber/e:episodeNumber/direct"
						element={<DirectEpisodePlayer />}
					/>

					{/* Final fallback route - redirects to home */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</ErrorBoundary>
		</BrowserRouter>
	);
};

export default App;
