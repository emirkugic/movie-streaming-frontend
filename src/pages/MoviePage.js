// src/pages/MoviePage.js - FINAL FIX
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, clearMovieDetails } from "../store/moviesSlice";
import { FaStar, FaPlus, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import {
	addToWatchlist,
	removeFromWatchlist,
	addToFavorites,
	removeFromFavorites,
} from "../store/userSlice";
import MediaGrid from "../components/common/MediaGrid";
import Loader from "../components/common/Loader";
import "../assets/styles/MoviePage.scss";

const MoviePage = () => {
	// Get movie slug from URL
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { currentMovie, loading } = useSelector((state) => state.movies);
	const { isAuthenticated } = useSelector((state) => state.auth);

	// Local state
	const [source, setSource] = useState("vidsrc"); // vidsrc is default
	const [inWatchlist, setInWatchlist] = useState(false);
	const [inFavorites, setInFavorites] = useState(false);

	// Fetch movie details when component mounts
	useEffect(() => {
		dispatch(fetchMovieDetails(slug));

		// Log for debugging
		console.log("Fetching movie details:", { slug });

		// Cleanup function
		return () => {
			dispatch(clearMovieDetails());
		};
	}, [dispatch, slug]);

	// Handle watchlist and favorites when movie data is loaded
	useEffect(() => {
		if (isAuthenticated && currentMovie) {
			// In a real app, you'd make API calls to check these
			setInWatchlist(false);
			setInFavorites(false);
		}
	}, [isAuthenticated, currentMovie]);

	// Handle watchlist toggle
	const handleWatchlistToggle = () => {
		if (!isAuthenticated || !currentMovie) return;

		if (inWatchlist) {
			dispatch(removeFromWatchlist({ type: "movie", id: currentMovie.id }));
			setInWatchlist(false);
		} else {
			dispatch(addToWatchlist({ type: "movie", id: currentMovie.id }));
			setInWatchlist(true);
		}
	};

	// Handle favorites toggle
	const handleFavoritesToggle = () => {
		if (!isAuthenticated || !currentMovie) return;

		if (inFavorites) {
			dispatch(removeFromFavorites({ type: "movie", id: currentMovie.id }));
			setInFavorites(false);
		} else {
			dispatch(addToFavorites({ type: "movie", id: currentMovie.id }));
			setInFavorites(true);
		}
	};

	// Show loading indicator while data is loading
	if (loading) {
		return <Loader />;
	}

	// Get movie ID and other details
	let movieId = null;
	let title = "Movie";

	if (currentMovie?.tmdb_id) {
		movieId = currentMovie.tmdb_id;
		title = currentMovie.title || title;
	}

	// If we still don't have a movieId, try to extract it from the slug
	if (!movieId && slug) {
		// Many slugs end with the ID, like "inception-27205"
		const slugParts = slug.split("-");
		const potentialId = slugParts[slugParts.length - 1];
		// Check if it's a number
		if (!isNaN(potentialId)) {
			movieId = potentialId;
		}
	}

	// If we still don't have any ID, show a friendly error
	if (!movieId) {
		return (
			<div className="movie-page">
				<div style={{ padding: "2rem", textAlign: "center" }}>
					<h1>Cannot Load Movie</h1>
					<p>
						Sorry, we couldn't identify the movie. Please try again or select a
						different movie.
					</p>
					<Link
						to="/"
						style={{
							display: "inline-block",
							marginTop: "1rem",
							padding: "0.5rem 1rem",
							background: "#e50914",
							color: "white",
							borderRadius: "4px",
							textDecoration: "none",
						}}
					>
						Back to Home
					</Link>
				</div>
			</div>
		);
	}

	// Build video URLs for each source
	const videoUrls = {
		vidsrc: `https://vidsrc.xyz/embed/movie/${movieId}`,
		"2embed": `https://www.2embed.cc/embed/${movieId}`,
	};

	// Get current source URL
	const currentUrl = videoUrls[source];

	// Extract movie details (if available)
	const {
		release_date,
		vote_average,
		overview,
		genres,
		credits,
		similar,
		recommendations,
	} = currentMovie || {};

	// Get image URLs
	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;
	const backdropUrl = currentMovie?.backdrop_path
		? `${imageBaseUrl}/original${currentMovie.backdrop_path}`
		: null;
	const posterUrl = currentMovie?.poster_path
		? `${imageBaseUrl}/w500${currentMovie.poster_path}`
		: null;

	// Extract directors and cast
	const directors =
		credits?.crew?.filter((person) => person.job === "Director") || [];
	const cast = credits?.cast?.slice(0, 10) || [];

	// Format release date
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="movie-page">
			{/* Backdrop image */}
			{backdropUrl && (
				<div
					className="movie-page__backdrop"
					style={{
						backgroundImage: `url(${backdropUrl})`,
					}}
				>
					<div className="movie-page__overlay"></div>
				</div>
			)}

			<div className="movie-page__content">
				{/* Source selector */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						margin: "15px 0",
					}}
				>
					<div
						style={{
							background: "rgba(0,0,0,0.5)",
							padding: "8px 16px",
							borderRadius: "4px",
							display: "flex",
							gap: "10px",
						}}
					>
						<button
							onClick={() => setSource("vidsrc")}
							style={{
								background:
									source === "vidsrc" ? "#e50914" : "rgba(255,255,255,0.2)",
								border: "none",
								padding: "8px 16px",
								borderRadius: "4px",
								color: "white",
								cursor: "pointer",
							}}
						>
							VidSrc
						</button>
						<button
							onClick={() => setSource("2embed")}
							style={{
								background:
									source === "2embed" ? "#e50914" : "rgba(255,255,255,0.2)",
								border: "none",
								padding: "8px 16px",
								borderRadius: "4px",
								color: "white",
								cursor: "pointer",
							}}
						>
							2Embed
						</button>
					</div>
				</div>

				{/* Display the current URL for debugging */}
				{process.env.NODE_ENV === "development" && (
					<div
						style={{
							background: "#333",
							padding: "8px 16px",
							margin: "0 auto 15px auto",
							borderRadius: "4px",
							maxWidth: "800px",
							wordBreak: "break-all",
							fontSize: "12px",
							fontFamily: "monospace",
						}}
					>
						Video URL: {currentUrl}
					</div>
				)}

				{/* Video container with direct iframe */}
				<div
					className="movie-page__video-container"
					style={{
						position: "relative",
						paddingBottom: "56.25%",
						height: 0,
						overflow: "hidden",
					}}
				>
					<iframe
						src={currentUrl}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							border: "none",
						}}
						allowFullScreen
						title={title}
					></iframe>
				</div>

				<div className="movie-page__info">
					<div className="movie-page__poster-container">
						{posterUrl && (
							<img src={posterUrl} alt={title} className="movie-page__poster" />
						)}
					</div>

					<div className="movie-page__details">
						<h1 className="movie-page__title">{title}</h1>

						<div className="movie-page__meta">
							{release_date && (
								<span className="movie-page__release-date">
									{formatDate(release_date)}
								</span>
							)}

							{typeof vote_average === "number" &&
								!isNaN(vote_average) &&
								vote_average > 0 && (
									<span className="movie-page__rating">
										<FaStar />
										<span>{vote_average.toFixed(1)}</span>
									</span>
								)}
						</div>

						{genres && genres.length > 0 && (
							<div className="movie-page__genres">
								{genres.map((genre) => (
									<span key={genre.id} className="movie-page__genre">
										{genre.name}
									</span>
								))}
							</div>
						)}

						{overview && (
							<div className="movie-page__overview">
								<h3>Overview</h3>
								<p>{overview}</p>
							</div>
						)}

						{isAuthenticated && (
							<div className="movie-page__actions">
								<button
									className={`movie-page__watchlist-btn ${
										inWatchlist ? "active" : ""
									}`}
									onClick={handleWatchlistToggle}
								>
									{inWatchlist ? <FaCheck /> : <FaPlus />}
									{inWatchlist ? "In Watchlist" : "Add to Watchlist"}
								</button>

								<button
									className={`movie-page__favorite-btn ${
										inFavorites ? "active" : ""
									}`}
									onClick={handleFavoritesToggle}
								>
									{inFavorites ? <FaHeart /> : <FaRegHeart />}
									{inFavorites ? "In Favorites" : "Add to Favorites"}
								</button>
							</div>
						)}

						{directors.length > 0 && (
							<div className="movie-page__directors">
								<h3>Director{directors.length > 1 ? "s" : ""}</h3>
								<div className="movie-page__directors-list">
									{directors.map((director) => (
										<span key={director.id} className="movie-page__director">
											{director.name}
										</span>
									))}
								</div>
							</div>
						)}

						{cast?.length > 0 && (
							<div className="movie-page__cast">
								<h3>Cast</h3>
								<div className="movie-page__cast-list">
									{cast.map((actor) => (
										<div key={actor.id} className="movie-page__cast-item">
											<div className="movie-page__cast-image">
												{actor.profile_path ? (
													<img
														src={`${imageBaseUrl}/w185${actor.profile_path}`}
														alt={actor.name}
													/>
												) : (
													<div className="movie-page__cast-placeholder"></div>
												)}
											</div>
											<div className="movie-page__cast-info">
												<p className="movie-page__cast-name">{actor.name}</p>
												{actor.character && (
													<p className="movie-page__cast-character">
														as {actor.character}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{similar?.results?.length > 0 && (
					<div className="movie-page__similar">
						<h2>Similar Movies</h2>
						<MediaGrid items={similar.results.slice(0, 6)} type="movie" />
					</div>
				)}

				{recommendations?.results?.length > 0 && (
					<div className="movie-page__recommendations">
						<h2>You May Also Like</h2>
						<MediaGrid
							items={recommendations.results.slice(0, 6)}
							type="movie"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default MoviePage;
