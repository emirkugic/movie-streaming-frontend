// src/components/common/MediaCard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaPlayCircle, FaPlus, FaCheck } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../../store/userSlice";
import "../../assets/styles/MediaCard.scss";

const MediaCard = ({ media, type = "movie" }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [inWatchlist, setInWatchlist] = useState(false); // This would come from a real API check
	const { isAuthenticated } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;
	const title = type === "movie" ? media.title : media.name;
	const date = type === "movie" ? media.release_date : media.first_air_date;
	const slug = media.slug;
	const posterPath = media.poster_path;
	const backdropPath = media.backdrop_path;
	const voteAverage = media.vote_average;

	const getYear = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).getFullYear();
	};

	const handleWatchlistToggle = (e) => {
		e.preventDefault(); // Prevent navigation
		e.stopPropagation(); // Prevent event bubbling

		if (inWatchlist) {
			dispatch(removeFromWatchlist({ type, id: media.id }));
			setInWatchlist(false);
		} else {
			dispatch(addToWatchlist({ type, id: media.id }));
			setInWatchlist(true);
		}
	};

	return (
		<div
			className={`media-card ${isHovered ? "hovered" : ""}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Link to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}>
				<div className="media-card__poster">
					{posterPath ? (
						<img
							src={`${imageBaseUrl}/w342${posterPath}`}
							alt={title}
							loading="lazy"
							className="media-card__poster-img"
						/>
					) : backdropPath ? (
						<img
							src={`${imageBaseUrl}/w780${backdropPath}`}
							alt={title}
							loading="lazy"
							className="media-card__poster-img media-card__backdrop-as-poster"
						/>
					) : (
						<div className="media-card__no-poster">
							<span>{title}</span>
						</div>
					)}

					{isHovered && (
						<div className="media-card__overlay">
							<div className="media-card__actions">
								<button className="media-card__play-btn">
									<FaPlayCircle />
								</button>

								{isAuthenticated && (
									<button
										className={`media-card__watchlist-btn ${
											inWatchlist ? "in-list" : ""
										}`}
										onClick={handleWatchlistToggle}
										aria-label={
											inWatchlist ? "Remove from watchlist" : "Add to watchlist"
										}
									>
										{inWatchlist ? <FaCheck /> : <FaPlus />}
									</button>
								)}
							</div>
						</div>
					)}

					{typeof voteAverage === "number" && voteAverage > 0 && (
						<div className="media-card__rating">
							<FaStar />
							<span>{voteAverage.toFixed(1)}</span>
						</div>
					)}
				</div>

				<div className="media-card__info">
					<h3 className="media-card__title">{title}</h3>
					{date && <p className="media-card__year">{getYear(date)}</p>}
				</div>
			</Link>
		</div>
	);
};

export default MediaCard;
