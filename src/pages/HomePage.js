import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTrendingMovies } from "../store/moviesSlice";
import { fetchTrendingTvShows } from "../store/tvShowsSlice";
import HeroSlider from "../components/common/HeroSlider";
import MediaGrid from "../components/common/MediaGrid";
import Loader from "../components/common/Loader";
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
		dispatch(fetchTrendingMovies());
		dispatch(fetchTrendingTvShows());
	}, [dispatch]);

	const isLoading = moviesLoading || tvShowsLoading;

	// Combine movies and TV shows for hero slider
	const heroItems = [
		...trendingMovies
			.slice(0, 3)
			.map((movie) => ({ ...movie, mediaType: "movie" })),
		...trendingTvShows
			.slice(0, 3)
			.map((tvShow) => ({ ...tvShow, mediaType: "tv" })),
	]
		.sort(() => Math.random() - 0.5)
		.slice(0, 5); // Shuffle and take 5

	return (
		<div className="home-page">
			{isLoading ? (
				<Loader />
			) : (
				<>
					{heroItems.length > 0 && (
						<section className="home-page__hero">
							<HeroSlider items={heroItems} type={(item) => item.mediaType} />
						</section>
					)}

					<section className="home-page__trending-movies">
						<div className="section-header">
							<h2>Trending Movies</h2>
							<Link to="/movies/trending" className="section-header__link">
								View All
							</Link>
						</div>

						<MediaGrid items={trendingMovies.slice(0, 6)} type="movie" />
					</section>

					<section className="home-page__trending-tv-shows">
						<div className="section-header">
							<h2>Trending TV Shows</h2>
							<Link to="/tv-shows/trending" className="section-header__link">
								View All
							</Link>
						</div>

						<MediaGrid items={trendingTvShows.slice(0, 6)} type="tv" />
					</section>
				</>
			)}
		</div>
	);
};

export default HomePage;
