import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, clearMovieDetails } from "../store/moviesSlice";
import { FaStar, FaPlus, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import {
	addToWatchlist,
	removeFromWatchlist,
	addToFavorites,
	removeFromFavorites,
} from "../store/userSlice";
import VideoPlayer from "../components/common/VideoPlayer";
import MediaGrid from "../components/common/MediaGrid";
import Loader from "../components/common/Loader";
import "../assets/styles/MoviePage.scss";

const MoviePage = () => {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { currentMovie, loading } = useSelector((state) => state.movies);
	const { isAuthenticated } = useSelector((state) => state.auth);

	const [inWatchlist, setInWatchlist] = useState(false);
	const [inFavorites, setInFavorites] = useState(false);

	useEffect(() => {
		dispatch(fetchMovieDetails(slug));

		return () => {
			dispatch(clearMovieDetails());
		};
	}, [dispatch, slug]);

	// Check if movie is in watchlist/favorites
	useEffect(() => {
		if (isAuthenticated && currentMovie) {
			// In a real app, you'd make API calls to check these
			setInWatchlist(false);
			setInFavorites(false);
		}
	}, [isAuthenticated, currentMovie]);

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

	if (loading || !currentMovie) {
		return <Loader />;
	}

	const {
		title,
		release_date,
		vote_average,
		overview,
		genres,
		sources,
		credits,
		similar,
		recommendations,
	} = currentMovie;

	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;
	const backdropUrl = currentMovie.backdrop_path
		? `${imageBaseUrl}/original${currentMovie.backdrop_path}`
		: null;
	const posterUrl = currentMovie.poster_path
		? `${imageBaseUrl}/w500${currentMovie.poster_path}`
		: null;

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
			<div
				className="movie-page__backdrop"
				style={{
					backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
				}}
			>
				<div className="movie-page__overlay"></div>
			</div>

			<div className="movie-page__content">
				<div className="movie-page__video-container">
					<VideoPlayer sources={sources} type="movie" id={currentMovie.id} />
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

						{cast.length > 0 && (
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
