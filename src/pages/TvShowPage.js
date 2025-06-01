import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTvShowDetails, clearTvShowDetails } from "../store/tvShowsSlice";
import { FaStar, FaPlus, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import {
	addToWatchlist,
	removeFromWatchlist,
	addToFavorites,
	removeFromFavorites,
} from "../store/userSlice";
import Loader from "../components/common/Loader";
import MediaGrid from "../components/common/MediaGrid";
import "../assets/styles/TvShowPage.scss";

const TvShowPage = () => {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { currentTvShow, loading } = useSelector((state) => state.tvShows);
	const { isAuthenticated } = useSelector((state) => state.auth);

	const [inWatchlist, setInWatchlist] = useState(false);
	const [inFavorites, setInFavorites] = useState(false);
	const [selectedSeason, setSelectedSeason] = useState(1);

	useEffect(() => {
		dispatch(fetchTvShowDetails(slug));

		return () => {
			dispatch(clearTvShowDetails());
		};
	}, [dispatch, slug]);

	// Set default selected season
	useEffect(() => {
		if (currentTvShow?.seasons?.length > 0) {
			// Find the first actual season (sometimes season 0 is specials)
			const firstSeason = currentTvShow.seasons.find(
				(season) => season.season_number > 0
			);
			if (firstSeason) {
				setSelectedSeason(firstSeason.season_number);
			}
		}
	}, [currentTvShow]);

	// Check if show is in watchlist/favorites
	useEffect(() => {
		if (isAuthenticated && currentTvShow) {
			// In a real app, you'd make API calls to check these
			setInWatchlist(false);
			setInFavorites(false);
		}
	}, [isAuthenticated, currentTvShow]);

	const handleWatchlistToggle = () => {
		if (!isAuthenticated || !currentTvShow) return;

		if (inWatchlist) {
			dispatch(removeFromWatchlist({ type: "tv", id: currentTvShow.id }));
			setInWatchlist(false);
		} else {
			dispatch(addToWatchlist({ type: "tv", id: currentTvShow.id }));
			setInWatchlist(true);
		}
	};

	const handleFavoritesToggle = () => {
		if (!isAuthenticated || !currentTvShow) return;

		if (inFavorites) {
			dispatch(removeFromFavorites({ type: "tv", id: currentTvShow.id }));
			setInFavorites(false);
		} else {
			dispatch(addToFavorites({ type: "tv", id: currentTvShow.id }));
			setInFavorites(true);
		}
	};

	if (loading || !currentTvShow) {
		return <Loader />;
	}

	const {
		name,
		first_air_date,
		vote_average,
		overview,
		genres,
		seasons,
		credits,
		similar,
		recommendations,
	} = currentTvShow;

	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;
	const backdropUrl = currentTvShow.backdrop_path
		? `${imageBaseUrl}/original${currentTvShow.backdrop_path}`
		: null;
	const posterUrl = currentTvShow.poster_path
		? `${imageBaseUrl}/w500${currentTvShow.poster_path}`
		: null;
	const creators =
		credits?.crew?.filter(
			(person) =>
				person.job === "Creator" || person.job === "Executive Producer"
		) || [];
	const cast = credits?.cast?.slice(0, 10) || [];

	// Format date
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Filter out season 0 (usually specials)
	const filteredSeasons =
		seasons?.filter((season) => season.season_number > 0) || [];

	// Get episodes for the selected season
	const selectedSeasonData = seasons?.find(
		(season) => season.season_number === selectedSeason
	);

	return (
		<div className="tv-show-page">
			<div
				className="tv-show-page__backdrop"
				style={{
					backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
				}}
			>
				<div className="tv-show-page__overlay"></div>
			</div>

			<div className="tv-show-page__content">
				<div className="tv-show-page__header">
					<div className="tv-show-page__poster-container">
						{posterUrl && (
							<img
								src={posterUrl}
								alt={name}
								className="tv-show-page__poster"
							/>
						)}
					</div>

					<div className="tv-show-page__details">
						<h1 className="tv-show-page__title">{name}</h1>

						<div className="tv-show-page__meta">
							{first_air_date && (
								<span className="tv-show-page__first-air-date">
									{formatDate(first_air_date)}
								</span>
							)}

							{typeof vote_average === "number" &&
								!isNaN(vote_average) &&
								vote_average > 0 && (
									<span className="tv-show-page__rating">
										<FaStar />
										<span>{vote_average.toFixed(1)}</span>
									</span>
								)}
						</div>

						{genres && genres.length > 0 && (
							<div className="tv-show-page__genres">
								{genres.map((genre) => (
									<span key={genre.id} className="tv-show-page__genre">
										{genre.name}
									</span>
								))}
							</div>
						)}

						{overview && (
							<div className="tv-show-page__overview">
								<h3>Overview</h3>
								<p>{overview}</p>
							</div>
						)}

						{isAuthenticated && (
							<div className="tv-show-page__actions">
								<button
									className={`tv-show-page__watchlist-btn ${
										inWatchlist ? "active" : ""
									}`}
									onClick={handleWatchlistToggle}
								>
									{inWatchlist ? <FaCheck /> : <FaPlus />}
									{inWatchlist ? "In Watchlist" : "Add to Watchlist"}
								</button>

								<button
									className={`tv-show-page__favorite-btn ${
										inFavorites ? "active" : ""
									}`}
									onClick={handleFavoritesToggle}
								>
									{inFavorites ? <FaHeart /> : <FaRegHeart />}
									{inFavorites ? "In Favorites" : "Add to Favorites"}
								</button>
							</div>
						)}

						{creators.length > 0 && (
							<div className="tv-show-page__creators">
								<h3>Creator{creators.length > 1 ? "s" : ""}</h3>
								<div className="tv-show-page__creators-list">
									{creators.map((creator) => (
										<span key={creator.id} className="tv-show-page__creator">
											{creator.name}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="tv-show-page__seasons">
					<h2>Seasons</h2>

					<div className="tv-show-page__seasons-tabs">
						{filteredSeasons.map((season) => (
							<button
								key={season.id}
								className={`tv-show-page__season-tab ${
									selectedSeason === season.season_number ? "active" : ""
								}`}
								onClick={() => setSelectedSeason(season.season_number)}
							>
								Season {season.season_number}
							</button>
						))}
					</div>

					{selectedSeasonData && (
						<div className="tv-show-page__episodes">
							<div className="tv-show-page__season-info">
								<div className="tv-show-page__season-poster">
									{selectedSeasonData.poster_path ? (
										<img
											src={`${imageBaseUrl}/w300${selectedSeasonData.poster_path}`}
											alt={`Season ${selectedSeason}`}
										/>
									) : (
										<div className="tv-show-page__season-poster-placeholder"></div>
									)}
								</div>

								<div className="tv-show-page__season-details">
									<h3>Season {selectedSeason}</h3>
									{selectedSeasonData.air_date && (
										<p className="tv-show-page__season-date">
											{formatDate(selectedSeasonData.air_date)}
										</p>
									)}
									{selectedSeasonData.episode_count && (
										<p className="tv-show-page__episode-count">
											{selectedSeasonData.episode_count} Episodes
										</p>
									)}
									{selectedSeasonData.overview && (
										<p className="tv-show-page__season-overview">
											{selectedSeasonData.overview}
										</p>
									)}
								</div>
							</div>

							<div className="tv-show-page__episodes-list">
								<h3>Episodes</h3>

								{/* This would come from the API in a real app */}
								<div className="tv-show-page__episode-items">
									{[...Array(selectedSeasonData.episode_count || 0)].map(
										(_, index) => (
											<Link
												key={index}
												to={`/tv-shows/${slug}/s${selectedSeason}/e${
													index + 1
												}`}
												className="tv-show-page__episode-item"
											>
												<div className="tv-show-page__episode-number">
													{index + 1}
												</div>
												<div className="tv-show-page__episode-info">
													<h4>Episode {index + 1}</h4>
													<p>Click to watch</p>
												</div>
											</Link>
										)
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				{cast.length > 0 && (
					<div className="tv-show-page__cast">
						<h2>Cast</h2>
						<div className="tv-show-page__cast-list">
							{cast.map((actor) => (
								<div key={actor.id} className="tv-show-page__cast-item">
									<div className="tv-show-page__cast-image">
										{actor.profile_path ? (
											<img
												src={`${imageBaseUrl}/w185${actor.profile_path}`}
												alt={actor.name}
											/>
										) : (
											<div className="tv-show-page__cast-placeholder"></div>
										)}
									</div>
									<div className="tv-show-page__cast-info">
										<p className="tv-show-page__cast-name">{actor.name}</p>
										{actor.character && (
											<p className="tv-show-page__cast-character">
												as {actor.character}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{similar?.results?.length > 0 && (
					<div className="tv-show-page__similar">
						<h2>Similar TV Shows</h2>
						<MediaGrid items={similar.results.slice(0, 6)} type="tv" />
					</div>
				)}

				{recommendations?.results?.length > 0 && (
					<div className="tv-show-page__recommendations">
						<h2>You May Also Like</h2>
						<MediaGrid items={recommendations.results.slice(0, 6)} type="tv" />
					</div>
				)}
			</div>
		</div>
	);
};

export default TvShowPage;
