import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPlus } from "react-icons/fa";
import "../../assets/styles/HeroSlider.scss";

const HeroSlider = ({ items, type }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % items.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [items.length]);

	if (!items || items.length === 0) {
		return null;
	}

	const item = items[currentSlide];
	const title = type === "movie" ? item.title : item.name;
	const date = type === "movie" ? item.release_date : item.first_air_date;
	const slug = item.slug;
	const backdropPath = item.backdrop_path;
	const overview = item.overview;

	const getYear = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).getFullYear();
	};

	return (
		<div className="hero-slider">
			<div
				className="hero-slider__backdrop"
				style={{
					backgroundImage: backdropPath
						? `url(${imageBaseUrl}/original${backdropPath})`
						: "none",
				}}
			>
				<div className="hero-slider__overlay"></div>
			</div>

			<div className="hero-slider__content">
				<h1 className="hero-slider__title">{title}</h1>

				{date && <p className="hero-slider__year">{getYear(date)}</p>}

				{overview && <p className="hero-slider__overview">{overview}</p>}

				<div className="hero-slider__actions">
					<Link
						to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}
						className="hero-slider__play-btn"
					>
						<FaPlay /> Watch Now
					</Link>

					<Link
						to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}
						className="hero-slider__info-btn"
					>
						<FaPlus /> More Info
					</Link>
				</div>
			</div>

			<div className="hero-slider__indicators">
				{items.map((_, index) => (
					<button
						key={index}
						className={`hero-slider__indicator ${
							index === currentSlide ? "active" : ""
						}`}
						onClick={() => setCurrentSlide(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default HeroSlider;
