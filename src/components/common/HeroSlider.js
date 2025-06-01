// src/components/common/HeroSlider.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
	FaPlay,
	FaInfoCircle,
	FaChevronLeft,
	FaChevronRight,
	FaStar,
} from "react-icons/fa";
import "../../assets/styles/HeroSlider.scss";

const HeroSlider = ({ items = [] }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const autoplayTimerRef = useRef(null);
	const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL;

	const resetAutoplayTimer = useCallback(() => {
		if (autoplayTimerRef.current) {
			clearTimeout(autoplayTimerRef.current);
		}

		autoplayTimerRef.current = setTimeout(() => {
			goToNextSlide();
		}, 8000); // 8 seconds between slides
	}, []);

	const goToNextSlide = useCallback(() => {
		if (!isTransitioning && items.length > 1) {
			setIsTransitioning(true);
			setCurrentSlide((prev) => (prev + 1) % items.length);

			setTimeout(() => {
				setIsTransitioning(false);
			}, 500); // Match this with CSS transition time
		}
	}, [isTransitioning, items.length]);

	const goToPrevSlide = useCallback(() => {
		if (!isTransitioning && items.length > 1) {
			setIsTransitioning(true);
			setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));

			setTimeout(() => {
				setIsTransitioning(false);
			}, 500); // Match this with CSS transition time
		}
	}, [isTransitioning, items.length]);

	const goToSlide = useCallback(
		(index) => {
			if (!isTransitioning && index !== currentSlide) {
				setIsTransitioning(true);
				setCurrentSlide(index);

				setTimeout(() => {
					setIsTransitioning(false);
				}, 500); // Match this with CSS transition time
			}
		},
		[currentSlide, isTransitioning]
	);

	// Handle touch events for mobile swiping
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (touchStart - touchEnd > 100) {
			// Swipe left, go to next slide
			goToNextSlide();
		} else if (touchStart - touchEnd < -100) {
			// Swipe right, go to previous slide
			goToPrevSlide();
		}
	};

	// Autoplay and cleanup
	useEffect(() => {
		resetAutoplayTimer();

		return () => {
			if (autoplayTimerRef.current) {
				clearTimeout(autoplayTimerRef.current);
			}
		};
	}, [currentSlide, resetAutoplayTimer]);

	// If there are no items or only one, simplify the component
	if (!items || items.length === 0) {
		return null;
	}

	if (items.length === 1) {
		return <SingleHeroItem item={items[0]} imageBaseUrl={imageBaseUrl} />;
	}

	const currentItem = items[currentSlide];
	const type =
		currentItem.media_type || (currentItem.first_air_date ? "tv" : "movie");
	const title = type === "movie" ? currentItem.title : currentItem.name;
	const year = getYear(
		type === "movie" ? currentItem.release_date : currentItem.first_air_date
	);
	const backdropPath = currentItem.backdrop_path;
	const voteAverage = currentItem.vote_average;
	const overview = currentItem.overview;
	const slug = currentItem.slug;

	// Get year helper function
	function getYear(dateString) {
		if (!dateString) return "";
		return new Date(dateString).getFullYear();
	}

	// Truncate overview text if too long
	function truncateOverview(text, maxLength = 200) {
		if (!text) return "";
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	}

	return (
		<div
			className="hero-slider"
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			<div className="hero-slider__container">
				<div
					className={`hero-slider__slides ${
						isTransitioning ? "transitioning" : ""
					}`}
					style={{ transform: `translateX(-${currentSlide * 100}%)` }}
				>
					{items.map((item, index) => {
						const itemType =
							item.media_type || (item.first_air_date ? "tv" : "movie");
						const itemTitle = itemType === "movie" ? item.title : item.name;
						const itemYear = getYear(
							itemType === "movie" ? item.release_date : item.first_air_date
						);
						const itemBackdropPath = item.backdrop_path;
						const itemVoteAverage = item.vote_average;
						const itemOverview = item.overview;
						const itemSlug = item.slug;

						return (
							<div className="hero-slider__slide" key={item.id}>
								<div
									className="hero-slider__backdrop"
									style={{
										backgroundImage: itemBackdropPath
											? `url(${imageBaseUrl}/original${itemBackdropPath})`
											: "linear-gradient(45deg, #111, #333)",
									}}
								>
									<div className="hero-slider__overlay"></div>
								</div>

								<div className="hero-slider__content container">
									<div className="hero-slider__info">
										<h1 className="hero-slider__title">{itemTitle}</h1>

										<div className="hero-slider__meta">
											{itemYear && (
												<span className="hero-slider__year">{itemYear}</span>
											)}

											{typeof itemVoteAverage === "number" &&
												itemVoteAverage > 0 && (
													<div className="hero-slider__rating">
														<FaStar /> <span>{itemVoteAverage.toFixed(1)}</span>
													</div>
												)}
										</div>

										{itemOverview && (
											<p className="hero-slider__overview">
												{truncateOverview(itemOverview)}
											</p>
										)}

										<div className="hero-slider__actions">
											<Link
												to={`/${
													itemType === "movie" ? "movies" : "tv-shows"
												}/${itemSlug}`}
												className="hero-slider__button hero-slider__button--primary"
											>
												<FaPlay /> <span>Watch Now</span>
											</Link>

											<Link
												to={`/${
													itemType === "movie" ? "movies" : "tv-shows"
												}/${itemSlug}`}
												className="hero-slider__button hero-slider__button--secondary"
											>
												<FaInfoCircle /> <span>More Info</span>
											</Link>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{items.length > 1 && (
					<>
						<button
							className="hero-slider__arrow hero-slider__arrow--left"
							onClick={goToPrevSlide}
							aria-label="Previous slide"
						>
							<FaChevronLeft />
						</button>

						<button
							className="hero-slider__arrow hero-slider__arrow--right"
							onClick={goToNextSlide}
							aria-label="Next slide"
						>
							<FaChevronRight />
						</button>

						<div className="hero-slider__indicators">
							{items.map((_, index) => (
								<button
									key={index}
									className={`hero-slider__indicator ${
										index === currentSlide ? "active" : ""
									}`}
									onClick={() => goToSlide(index)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

// Helper component for a single hero item (no controls needed)
const SingleHeroItem = ({ item, imageBaseUrl }) => {
	const type = item.media_type || (item.first_air_date ? "tv" : "movie");
	const title = type === "movie" ? item.title : item.name;
	const year =
		item.release_date || item.first_air_date
			? new Date(item.release_date || item.first_air_date).getFullYear()
			: "";
	const backdropPath = item.backdrop_path;
	const voteAverage = item.vote_average;
	const overview = item.overview;
	const slug = item.slug;

	return (
		<div className="hero-slider">
			<div className="hero-slider__container">
				<div className="hero-slider__slides">
					<div className="hero-slider__slide">
						<div
							className="hero-slider__backdrop"
							style={{
								backgroundImage: backdropPath
									? `url(${imageBaseUrl}/original${backdropPath})`
									: "linear-gradient(45deg, #111, #333)",
							}}
						>
							<div className="hero-slider__overlay"></div>
						</div>

						<div className="hero-slider__content container">
							<div className="hero-slider__info">
								<h1 className="hero-slider__title">{title}</h1>

								<div className="hero-slider__meta">
									{year && <span className="hero-slider__year">{year}</span>}

									{typeof voteAverage === "number" && voteAverage > 0 && (
										<div className="hero-slider__rating">
											<FaStar /> <span>{voteAverage.toFixed(1)}</span>
										</div>
									)}
								</div>

								{overview && (
									<p className="hero-slider__overview">{overview}</p>
								)}

								<div className="hero-slider__actions">
									<Link
										to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}
										className="hero-slider__button hero-slider__button--primary"
									>
										<FaPlay /> <span>Watch Now</span>
									</Link>

									<Link
										to={`/${type === "movie" ? "movies" : "tv-shows"}/${slug}`}
										className="hero-slider__button hero-slider__button--secondary"
									>
										<FaInfoCircle /> <span>More Info</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroSlider;
