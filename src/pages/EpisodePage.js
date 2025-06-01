// src/pages/EpisodePage.js - Fixed with more flexible parameter handling
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpisodeDetails } from "../store/tvShowsSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Loader from "../components/common/Loader";
import "../assets/styles/EpisodePage.scss";

const EpisodePage = () => {
	// Get parameters from URL
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();
	const { currentEpisode, currentTvShow, loading } = useSelector(
		(state) => state.tvShows
	);

	// Local state
	const [source, setSource] = useState("vidsrc");

	// Output all available params for debugging
	console.log("EpisodePage params:", params);
	console.log("EpisodePage location:", location);

	// Flexibly parse season and episode numbers from various possible URL formats
	let sNum = 1;
	let eNum = 1;
	let slug = params.slug || "";

	// Check all possible parameter formats
	if (params.seasonNumber) {
		// Format: /tv-shows/:slug/s:seasonNumber/e:episodeNumber
		sNum = parseInt(params.seasonNumber.toString().replace(/\D/g, ""), 10) || 1;

		if (params.episodeNumber) {
			eNum =
				parseInt(params.episodeNumber.toString().replace(/\D/g, ""), 10) || 1;
		}
	} else if (params.seasonParam && params.episodeParam) {
		// Format: /tv-shows/:slug/:seasonParam/:episodeParam
		const seasonStr = params.seasonParam.toString();
		const episodeStr = params.episodeParam.toString();

		// Handle formats like "s1" or just "1"
		sNum = parseInt(seasonStr.replace(/\D/g, ""), 10) || 1;
		eNum = parseInt(episodeStr.replace(/\D/g, ""), 10) || 1;
	} else {
		// Try to parse from path segments directly if params aren't available
		const pathSegments = location.pathname.split("/");

		if (pathSegments.length >= 4) {
			const seasonStr = pathSegments[3];
			sNum = parseInt(seasonStr.replace(/\D/g, ""), 10) || 1;
		}

		if (pathSegments.length >= 5) {
			const episodeStr = pathSegments[4];
			eNum = parseInt(episodeStr.replace(/\D/g, ""), 10) || 1;
		}
	}

	// Extract TV show ID from slug (this is the key fix)
	const getIdFromSlug = (slug) => {
		if (!slug) return null;

		// Most slugs end with the TMDB ID, e.g. "breaking-bad-1396"
		const parts = slug.split("-");
		const lastPart = parts[parts.length - 1];

		// Check if the last part is a number
		if (!isNaN(lastPart)) {
			return lastPart;
		}

		return null;
	};

	// Always have a valid TV show ID by extracting from slug
	const tvShowId = getIdFromSlug(slug);

	console.log("Parsed values:", { slug, tvShowId, sNum, eNum });

	// For page title and navigation
	const [showDetails, setShowDetails] = useState({
		name: "TV Show",
		episodeName: `Season ${sNum}, Episode ${eNum}`,
	});

	// Fetch episode details when component mounts
	useEffect(() => {
		// Only fetch if we have a valid slug
		if (slug) {
			dispatch(
				fetchEpisodeDetails({
					slug,
					seasonNumber: sNum,
					episodeNumber: eNum,
				})
			);
		}
	}, [dispatch, slug, sNum, eNum]);

	// Update show details when data is loaded
	useEffect(() => {
		if (currentEpisode?.tv_show) {
			setShowDetails({
				name: currentEpisode.tv_show.name || "TV Show",
				episodeName:
					currentEpisode.episode?.name || `Season ${sNum}, Episode ${eNum}`,
			});
		} else if (currentTvShow) {
			setShowDetails({
				name: currentTvShow.name || "TV Show",
				episodeName: `Season ${sNum}, Episode ${eNum}`,
			});
		}
	}, [currentEpisode, currentTvShow, sNum, eNum]);

	// Get video URLs
	const getVideoUrl = (source) => {
		if (source === "vidsrc") {
			return `https://vidsrc.xyz/embed/tv/${tvShowId}/${sNum}-${eNum}`;
		} else {
			return `https://www.2embed.cc/embedtv/${tvShowId}&s=${sNum}&e=${eNum}`;
		}
	};

	// Navigation URLs
	const hasPrevEpisode = eNum > 1;
	const hasNextEpisode = true;
	const prevEpisodeUrl = hasPrevEpisode
		? `/tv-shows/${slug}/s${sNum}/e${eNum - 1}`
		: null;
	const nextEpisodeUrl = hasNextEpisode
		? `/tv-shows/${slug}/s${sNum}/e${eNum + 1}`
		: null;
	const backToShowUrl = `/tv-shows/${slug}`;

	// Get overview
	const overview = currentEpisode?.episode?.overview || "";

	return (
		<div className="episode-page">
			{/* Show loading indicator while fetching data */}
			{loading && <Loader />}

			<div className="episode-page__header">
				<Link to={backToShowUrl} className="episode-page__back-btn">
					<FaArrowLeft /> Back to {showDetails.name}
				</Link>
				<h1 className="episode-page__title">
					{showDetails.name} - S{sNum}:E{eNum} - {showDetails.episodeName}
				</h1>
			</div>

			{/* Source selector */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginBottom: "15px",
				}}
			>
				<div
					style={{
						background: "rgba(0,0,0,0.5)",
						padding: "8px 16px",
						borderRadius: "4px",
						display: "flex",
						gap: "10px",
					}}
				>
					<button
						onClick={() => setSource("vidsrc")}
						style={{
							background:
								source === "vidsrc" ? "#e50914" : "rgba(255,255,255,0.2)",
							border: "none",
							padding: "8px 16px",
							borderRadius: "4px",
							color: "white",
							cursor: "pointer",
						}}
					>
						VidSrc
					</button>
					<button
						onClick={() => setSource("2embed")}
						style={{
							background:
								source === "2embed" ? "#e50914" : "rgba(255,255,255,0.2)",
							border: "none",
							padding: "8px 16px",
							borderRadius: "4px",
							color: "white",
							cursor: "pointer",
						}}
					>
						2Embed
					</button>
				</div>
			</div>

			{/* Always show the video player, regardless of loading state */}
			<div
				className="episode-page__video-container"
				style={{
					position: "relative",
					paddingBottom: "56.25%",
					height: 0,
					overflow: "hidden",
				}}
			>
				{tvShowId ? (
					<iframe
						src={getVideoUrl(source)}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							border: "none",
						}}
						allowFullScreen
						title={`${showDetails.name} S${sNum}E${eNum}`}
					></iframe>
				) : (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "#111",
							color: "#fff",
							textAlign: "center",
							padding: "20px",
						}}
					>
						<div>
							<h3>Could not determine TV show ID</h3>
							<p>Please try a different TV show or episode.</p>
						</div>
					</div>
				)}
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
					Episode {eNum}: {showDetails.episodeName}
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
