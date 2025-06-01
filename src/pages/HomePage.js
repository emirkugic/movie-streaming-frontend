// src/pages/HomePage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTrendingMovies } from "../store/moviesSlice";
import { fetchTrendingTvShows } from "../store/tvShowsSlice";
import HeroSlider from "../components/common/HeroSlider";
import MediaGrid from "../components/common/MediaGrid";
import Loader from "../components/common/Loader";
import { FaFilm, FaTv, FaFire, FaStar, FaCalendarAlt } from "react-icons/fa";
import "../assets/styles/HomePage.scss";

const HomePage = () => {
	const dispatch = useDispatch();
	const { trendingMovies, loading: moviesLoading } = useSelector(
		(state) => state.movies
	);
	const { trendingTvShows, loading: tvShowsLoading } = useSelector(
		(state) => state.tvShows
	);

	useEffect(() => {
		// Scroll to top on mount
		window.scrollTo(0, 0);

		// Fetch data
		dispatch(fetchTrendingMovies());
		dispatch(fetchTrendingTvShows());
	}, [dispatch]);

	// Overall loading state
	const isLoading = moviesLoading || tvShowsLoading;

	// Combine and prepare hero items
	const prepareHeroItems = () => {
		if (!trendingMovies.length && !trendingTvShows.length) return [];

		// Get top items with good backdrop images
		const topMovies = trendingMovies
			.filter((movie) => movie.backdrop_path && movie.overview)
			.slice(0, 3)
			.map((movie) => ({ ...movie, media_type: "movie" }));

		const topTvShows = trendingTvShows
			.filter((show) => show.backdrop_path && show.overview)
			.slice(0, 3)
			.map((show) => ({ ...show, media_type: "tv" }));

		// Combine and shuffle
		return [...topMovies, ...topTvShows]
			.sort(() => Math.random() - 0.5)
			.slice(0, 5);
	};

	const heroItems = prepareHeroItems();

	return (
		<div className="home-page">
			{isLoading ? (
				<div className="home-page__loader">
					<Loader />
				</div>
			) : (
				<>
					{/* Hero Slider */}
					{heroItems.length > 0 && (
						<section className="home-page__hero">
							<HeroSlider items={heroItems} />
						</section>
					)}

					{/* Quick Categories */}
					<section className="home-page__categories">
						<div className="container">
							<div className="categories-grid">
								<Link to="/movies" className="category-card">
									<div className="category-card__icon">
										<FaFilm />
									</div>
									<h3 className="category-card__title">Movies</h3>
								</Link>

								<Link to="/tv-shows" className="category-card">
									<div className="category-card__icon">
										<FaTv />
									</div>
									<h3 className="category-card__title">TV Shows</h3>
								</Link>

								<Link to="/trending" className="category-card">
									<div className="category-card__icon">
										<FaFire />
									</div>
									<h3 className="category-card__title">Trending</h3>
								</Link>

								<Link to="/top-rated" className="category-card">
									<div className="category-card__icon">
										<FaStar />
									</div>
									<h3 className="category-card__title">Top Rated</h3>
								</Link>

								<Link to="/upcoming" className="category-card">
									<div className="category-card__icon">
										<FaCalendarAlt />
									</div>
									<h3 className="category-card__title">Upcoming</h3>
								</Link>
							</div>
						</div>
					</section>

					{/* Main Content Sections */}
					<div className="container">
						{/* Trending Movies */}
						<section className="home-page__section">
							<MediaGrid
								items={trendingMovies.slice(0, 12)}
								type="movie"
								title="Trending Movies"
								viewAllLink="/movies/trending"
								viewAllText="View All Movies"
								loading={moviesLoading}
								emptyMessage="No trending movies found. Please try again later."
							/>
						</section>

						{/* Trending TV Shows */}
						<section className="home-page__section">
							<MediaGrid
								items={trendingTvShows.slice(0, 12)}
								type="tv"
								title="Trending TV Shows"
								viewAllLink="/tv-shows/trending"
								viewAllText="View All TV Shows"
								loading={tvShowsLoading}
								emptyMessage="No trending TV shows found. Please try again later."
							/>
						</section>
					</div>

					{/* Featured Section */}
					<section className="home-page__featured">
						<div className="container">
							<div className="featured-content">
								<div className="featured-content__text">
									<h2 className="featured-content__title">
										Your Personal Streaming Platform
									</h2>
									<p className="featured-content__description">
										Access thousands of movies and TV shows in one place. Stream
										your favorite content anytime, anywhere.
									</p>
									<div className="featured-content__actions">
										<Link to="/about" className="btn">
											Learn More
										</Link>
									</div>
								</div>
								<div className="featured-content__image">
									<img
										src="/featured-devices.png"
										alt="Watch on multiple devices"
									/>
								</div>
							</div>
						</div>
					</section>
				</>
			)}
		</div>
	);
};

export default HomePage;
