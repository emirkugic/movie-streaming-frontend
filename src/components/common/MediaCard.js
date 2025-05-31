import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../../assets/styles/MediaCard.scss";

const MediaCard = ({ media, type }) => {
	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;
	const title = type === "movie" ? media.title : media.name;
	const date = type === "movie" ? media.release_date : media.first_air_date;
	const slug = media.slug;
	const posterPath = media.poster_path;
	const voteAverage = media.vote_average;

	const getYear = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).getFullYear();
	};

	return (
		<div className="media-card">
			<Link to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}>
				<div className="media-card__poster">
					{posterPath ? (
						<img
							src={`${imageBaseUrl}/w342${posterPath}`}
							alt={title}
							loading="lazy"
						/>
					) : (
						<div className="media-card__no-poster">
							<span>{title}</span>
						</div>
					)}

					{voteAverage > 0 && (
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
