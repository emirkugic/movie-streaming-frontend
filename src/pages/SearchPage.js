import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setSearchQuery,
	searchContent,
	clearSearchResults,
} from "../store/searchSlice";
import MediaGrid from "../components/common/MediaGrid";
import Loader from "../components/common/Loader";
import "../assets/styles/SearchPage.scss";

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();
	const { query, results, loading } = useSelector((state) => state.search);

	const searchQuery = searchParams.get("q") || "";

	useEffect(() => {
		if (searchQuery && searchQuery !== query) {
			dispatch(setSearchQuery(searchQuery));
			dispatch(searchContent(searchQuery));
		}

		return () => {
			dispatch(clearSearchResults());
		};
	}, [dispatch, searchQuery, query]);

	return (
		<div className="search-page">
			<div className="search-page__header">
				<h1>Search Results for "{searchQuery}"</h1>
			</div>

			{loading ? (
				<Loader />
			) : (
				<div className="search-page__results">
					{results.movies.length > 0 && (
						<section className="search-page__section">
							<h2>Movies</h2>
							<MediaGrid items={results.movies} type="movie" />
						</section>
					)}

					{results.tvShows.length > 0 && (
						<section className="search-page__section">
							<h2>TV Shows</h2>
							<MediaGrid items={results.tvShows} type="tv" />
						</section>
					)}

					{results.movies.length === 0 && results.tvShows.length === 0 && (
						<div className="search-page__no-results">
							<p>No results found for "{searchQuery}"</p>
							<p>Try searching for a different movie or TV show.</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchPage;
