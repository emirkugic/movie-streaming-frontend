import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpisodeDetails } from "../store/tvShowsSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import VideoPlayer from "../components/common/VideoPlayer";
import Loader from "../components/common/Loader";
import "../assets/styles/EpisodePage.scss";

const EpisodePage = () => {
	const { slug, seasonNumber, episodeNumber } = useParams();
	const dispatch = useDispatch();
	const { currentEpisode, currentTvShow, loading } = useSelector(
		(state) => state.tvShows
	);

	const sNum = parseInt(seasonNumber.replace("s", ""), 10);
	const eNum = parseInt(episodeNumber.replace("e", ""), 10);

	useEffect(() => {
		dispatch(
			fetchEpisodeDetails({
				slug,
				seasonNumber: sNum,
				episodeNumber: eNum,
			})
		);
	}, [dispatch, slug, sNum, eNum]);

	if (loading || !currentEpisode || !currentTvShow) {
		return <Loader />;
	}

	const { tv_show, episode } = currentEpisode;
	const { name, overview, sources } = episode;
	const tvShowName = tv_show.name;

	// Check if next/previous episodes exist
	const hasPrevEpisode = eNum > 1;
	const hasNextEpisode = true; // In a real app, you'd check the actual episode count

	const prevEpisodeUrl = hasPrevEpisode
		? `/tv-shows/${slug}/s${sNum}/e${eNum - 1}`
		: null;

	const nextEpisodeUrl = hasNextEpisode
		? `/tv-shows/${slug}/s${sNum}/e${eNum + 1}`
		: null;

	const backToShowUrl = `/tv-shows/${slug}`;

	return (
		<div className="episode-page">
			<div className="episode-page__header">
				<Link to={backToShowUrl} className="episode-page__back-btn">
					Back to {tvShowName}
				</Link>
				<h1 className="episode-page__title">
					{tvShowName} - S{sNum}:E{eNum} - {name}
				</h1>
			</div>

			<div className="episode-page__video-container">
				<VideoPlayer
					sources={
						sources || {
							vidsrc: `https://vidsrc.xyz/embed/tv?tmdb=${
								tv_show.id || ""
							}&season=${sNum || 1}&episode=${eNum || 1}`,
							"2embed": `https://www.2embed.cc/embed/tv?tmdb=${
								tv_show.id || ""
							}&s=${sNum || 1}&e=${eNum || 1}`,
						}
					}
					type="episode"
					id={episode.id}
				/>
			</div>

			<div className="episode-page__navigation">
				{hasPrevEpisode && (
					<Link
						to={prevEpisodeUrl}
						className="episode-page__nav-btn episode-page__prev-btn"
					>
						<FaArrowLeft /> Previous Episode
					</Link>
				)}

				{hasNextEpisode && (
					<Link
						to={nextEpisodeUrl}
						className="episode-page__nav-btn episode-page__next-btn"
					>
						Next Episode <FaArrowRight />
					</Link>
				)}
			</div>

			<div className="episode-page__details">
				<h2>
					Episode {eNum}: {name}
				</h2>

				{overview && (
					<div className="episode-page__overview">
						<p>{overview}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EpisodePage;
