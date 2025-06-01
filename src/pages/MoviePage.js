// src/pages/MoviePage.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, clearMovieDetails } from "../store/moviesSlice";
import {
	FaStar,
	FaPlay,
	FaPlus,
	FaHeart,
	FaRegHeart,
	FaCheck,
	FaArrowLeft,
	FaShareAlt,
	FaCalendarAlt,
	FaClock,
	FaGlobe,
} from "react-icons/fa";
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
	const navigate = useNavigate();
	const { currentMovie, loading } = useSelector((state) => state.movies);
	const { isAuthenticated } = useSelector((state) => state.auth);

	// Local state
	const [source, setSource] = useState("vidsrc"); // vidsrc is default
	const [inWatchlist, setInWatchlist] = useState(false);
	const [inFavorites, setInFavorites] = useState(false);
	const [showTrailer, setShowTrailer] = useState(false);
	const playerRef = useRef(null);
	const detailsRef = useRef(null);

	// Scroll to top on mount
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	// Fetch movie details when component mounts
	useEffect(() => {
		dispatch(fetchMovieDetails(slug));

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

	// Scroll to player when Watch Now is clicked
	const scrollToPlayer = () => {
		playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	// Scroll to details when More Info is clicked
	const scrollToDetails = () => {
		detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	// Handle share functionality
	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: currentMovie?.title,
					text: `Check out ${currentMovie?.title} on Araneum Stream`,
					url: window.location.href,
				})
				.catch((error) => console.log("Sharing failed", error));
		} else {
			// Fallback - copy to clipboard
			navigator.clipboard
				.writeText(window.location.href)
				.then(() => alert("Link copied to clipboard!"))
				.catch((err) => console.error("Could not copy text: ", err));
		}
	};

	// Show loading indicator while data is loading
	if (loading) {
		return (
			<div className="movie-page movie-page--loading">
				<Loader />
			</div>
		);
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
			<div className="movie-page movie-page--error">
				<div className="container">
					<div className="movie-page__error">
						<h1>Cannot Load Movie</h1>
						<p>
							Sorry, we couldn't identify the movie. Please try again or select
							a different movie.
						</p>
						<div className="movie-page__error-actions">
							<button className="btn" onClick={() => navigate(-1)}>
								<FaArrowLeft /> Go Back
							</button>
							<Link to="/" className="btn btn-secondary">
								Go to Home
							</Link>
						</div>
					</div>
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
		runtime,
		overview,
		genres,
		credits,
		similar,
		recommendations,
		videos,
		homepage,
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

	// Format runtime
	const formatRuntime = (minutes) => {
		if (!minutes) return "";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	// Find trailer
	const trailer =
		videos?.results?.find(
			(video) => video.type === "Trailer" && video.site === "YouTube"
		) || videos?.results?.[0];

	return (
		<div className="movie-page">
			{/* Movie Hero Section */}
			<div className="movie-hero">
				<div
					className="movie-hero__backdrop"
					style={{
						backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
					}}
				>
					<div className="movie-hero__overlay"></div>
				</div>

				<div className="container">
					<div className="movie-hero__content">
						<div className="movie-hero__poster">
							{posterUrl ? (
								<img src={posterUrl} alt={title} />
							) : (
								<div className="movie-hero__no-poster">
									<span>{title}</span>
								</div>
							)}
						</div>

						<div className="movie-hero__info">
							<h1 className="movie-hero__title">{title}</h1>

							<div className="movie-hero__meta">
								{release_date && (
									<div className="movie-hero__meta-item">
										<FaCalendarAlt />
										<span>{formatDate(release_date)}</span>
									</div>
								)}

								{runtime > 0 && (
									<div className="movie-hero__meta-item">
										<FaClock />
										<span>{formatRuntime(runtime)}</span>
									</div>
								)}

								{typeof vote_average === "number" && vote_average > 0 && (
									<div className="movie-hero__meta-item movie-hero__rating">
										<FaStar />
										<span>{vote_average.toFixed(1)}</span>
									</div>
								)}

								{homepage && (
									<div className="movie-hero__meta-item">
										<a
											href={homepage}
											target="_blank"
											rel="noopener noreferrer"
											className="movie-hero__website"
										>
											<FaGlobe />
											<span>Website</span>
										</a>
									</div>
								)}
							</div>

							{genres && genres.length > 0 && (
								<div className="movie-hero__genres">
									{genres.map((genre) => (
										<span key={genre.id} className="movie-hero__genre">
											{genre.name}
										</span>
									))}
								</div>
							)}

							{overview && <p className="movie-hero__overview">{overview}</p>}

							<div className="movie-hero__actions">
								<button className="btn btn-icon" onClick={scrollToPlayer}>
									<FaPlay /> Watch Now
								</button>

								{trailer && (
									<button
										className="btn btn-secondary btn-icon"
										onClick={() => setShowTrailer(true)}
									>
										<FaPlay /> Watch Trailer
									</button>
								)}

								{isAuthenticated && (
									<>
										<button
											className={`movie-hero__action-btn ${
												inWatchlist ? "in-list" : ""
											}`}
											onClick={handleWatchlistToggle}
											aria-label={
												inWatchlist
													? "Remove from watchlist"
													: "Add to watchlist"
											}
										>
											{inWatchlist ? <FaCheck /> : <FaPlus />}
										</button>

										<button
											className={`movie-hero__action-btn ${
												inFavorites ? "favorite" : ""
											}`}
											onClick={handleFavoritesToggle}
											aria-label={
												inFavorites
													? "Remove from favorites"
													: "Add to favorites"
											}
										>
											{inFavorites ? <FaHeart /> : <FaRegHeart />}
										</button>
									</>
								)}

								<button
									className="movie-hero__action-btn"
									onClick={handleShare}
									aria-label="Share"
								>
									<FaShareAlt />
								</button>
							</div>

							{directors.length > 0 && (
								<div className="movie-hero__director">
									<span>Director: </span>
									{directors.map((director, index) => (
										<span key={director.id}>
											{director.name}
											{index < directors.length - 1 ? ", " : ""}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Movie Player Section */}
			<div className="movie-player" ref={playerRef}>
				<div className="container">
					<div className="movie-player__header">
						<h2 className="movie-player__title">Watch: {title}</h2>

						<div className="movie-player__sources">
							<button
								className={`movie-player__source ${
									source === "vidsrc" ? "active" : ""
								}`}
								onClick={() => setSource("vidsrc")}
							>
								VidSrc
							</button>
							<button
								className={`movie-player__source ${
									source === "2embed" ? "active" : ""
								}`}
								onClick={() => setSource("2embed")}
							>
								2Embed
							</button>
						</div>
					</div>

					<div className="movie-player__container">
						<iframe
							src={currentUrl}
							allowFullScreen
							title={title}
							className="movie-player__iframe"
						></iframe>
					</div>
				</div>
			</div>

			{/* Movie Details Section */}
			<div className="movie-details" ref={detailsRef}>
				<div className="container">
					{/* Cast Section */}
					{cast?.length > 0 && (
						<div className="movie-cast">
							<h2 className="section-title">Cast</h2>
							<div className="movie-cast__grid">
								{cast.map((actor) => (
									<div key={actor.id} className="movie-cast__item">
										<div className="movie-cast__image">
											{actor.profile_path ? (
												<img
													src={`${imageBaseUrl}/w185${actor.profile_path}`}
													alt={actor.name}
												/>
											) : (
												<div className="movie-cast__placeholder">
													{actor.name.charAt(0)}
												</div>
											)}
										</div>
										<div className="movie-cast__info">
											<h4 className="movie-cast__name">{actor.name}</h4>
											{actor.character && (
												<p className="movie-cast__character">
													{actor.character}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Similar Movies Section */}
					{similar?.results?.length > 0 && (
						<MediaGrid
							items={similar.results.slice(0, 12)}
							type="movie"
							title="Similar Movies"
						/>
					)}

					{/* Recommendations Section */}
					{recommendations?.results?.length > 0 && (
						<MediaGrid
							items={recommendations.results.slice(0, 12)}
							type="movie"
							title="You May Also Like"
						/>
					)}
				</div>
			</div>

			{/* Trailer Modal */}
			{showTrailer && trailer && (
				<div className="trailer-modal">
					<div
						className="trailer-modal__backdrop"
						onClick={() => setShowTrailer(false)}
					></div>
					<div className="trailer-modal__content">
						<button
							className="trailer-modal__close"
							onClick={() => setShowTrailer(false)}
							aria-label="Close trailer"
						>
							&times;
						</button>
						<iframe
							src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
							title={`${title} Trailer`}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="trailer-modal__iframe"
						></iframe>
					</div>
				</div>
			)}
		</div>
	);
};

export default MoviePage;
