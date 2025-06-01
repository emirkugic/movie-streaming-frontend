// src/components/common/VideoPlayer.js
import React, { useState, useEffect, useRef } from "react";
import {
	FaPlay,
	FaPause,
	FaVolumeUp,
	FaVolumeMute,
	FaExpand,
} from "react-icons/fa";
import "../../assets/styles/VideoPlayer.scss";

const VideoPlayer = ({ sources, type, id }) => {
	const [currentSource, setCurrentSource] = useState("vidsrc");
	const [showControls, setShowControls] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const playerContainerRef = useRef(null);
	const controlsTimeoutRef = useRef(null);

	// Get URL for current source
	const getSourceUrl = () => {
		// Get season and episode numbers if applicable
		const seasonNum = sources?.season || 1;
		const episodeNum = sources?.episode || 1;

		// If sources object is provided and has the current source, use that
		if (sources && typeof sources === "object" && sources[currentSource]) {
			return sources[currentSource];
		}

		// Otherwise build URL based on the documented format
		if (currentSource === "vidsrc") {
			return type === "movie"
				? `https://vidsrc.xyz/embed/movie/${id}`
				: `https://vidsrc.xyz/embed/tv/${id}/${seasonNum}-${episodeNum}`;
		} else if (currentSource === "2embed") {
			return type === "movie"
				? `https://www.2embed.cc/embed/${id}`
				: `https://www.2embed.cc/embedtv/${id}&s=${seasonNum}&e=${episodeNum}`;
		}

		return "";
	};

	// Toggle source between available providers
	const toggleSource = () => {
		setCurrentSource((prev) => (prev === "vidsrc" ? "2embed" : "vidsrc"));
		setIsLoading(true);
		setHasError(false);
	};

	// Handle iframe load events
	const handleIframeLoad = () => {
		setIsLoading(false);
	};

	// Handle iframe error
	const handleIframeError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	// Control visibility of controls based on mouse movement
	useEffect(() => {
		const handleMouseMove = () => {
			setShowControls(true);

			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}

			controlsTimeoutRef.current = setTimeout(() => {
				setShowControls(false);
			}, 3000);
		};

		const playerContainer = playerContainerRef.current;
		if (playerContainer) {
			playerContainer.addEventListener("mousemove", handleMouseMove);
		}

		return () => {
			if (playerContainer) {
				playerContainer.removeEventListener("mousemove", handleMouseMove);
			}

			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}
		};
	}, []);

	// Log debugging info when sources or parameters change
	useEffect(() => {
		console.log("VideoPlayer - Received props:", { sources, type, id });
		console.log("VideoPlayer - Current source URL:", getSourceUrl());
	}, [sources, type, id, currentSource]);

	return (
		<div className="video-player" ref={playerContainerRef}>
			{/* Simplified player using iframe */}
			<div
				className="video-player__iframe-container"
				style={{ width: "100%", height: "100%", position: "relative" }}
			>
				<iframe
					src={getSourceUrl()}
					width="100%"
					height="100%"
					frameBorder="0"
					scrolling="no"
					allowFullScreen
					title="Video Player"
					onLoad={handleIframeLoad}
					onError={handleIframeError}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
					}}
				/>
			</div>

			{/* Loading indicator */}
			{isLoading && (
				<div className="video-player__loader">
					<div className="video-player__spinner"></div>
				</div>
			)}

			{/* Error message */}
			{hasError && (
				<div
					className="video-player__error"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						background: "rgba(0, 0, 0, 0.8)",
						padding: "20px",
						borderRadius: "8px",
						textAlign: "center",
					}}
				>
					<p>Error loading video from this source.</p>
					<p>Please try another source or check your connection.</p>
					<button
						onClick={toggleSource}
						style={{
							background: "#e50914",
							color: "white",
							border: "none",
							padding: "8px 16px",
							borderRadius: "4px",
							marginTop: "10px",
							cursor: "pointer",
						}}
					>
						Try {currentSource === "vidsrc" ? "2Embed" : "VidSrc"} Instead
					</button>
				</div>
			)}

			{/* Simplified controls - just the source switcher */}
			{showControls && (
				<div
					className="video-player__simplified-controls"
					style={{
						position: "absolute",
						bottom: "20px",
						right: "20px",
						background: "rgba(0, 0, 0, 0.7)",
						padding: "8px 12px",
						borderRadius: "4px",
						zIndex: 10,
					}}
				>
					<button
						onClick={toggleSource}
						style={{
							background: "transparent",
							color: "white",
							border: "1px solid rgba(255, 255, 255, 0.5)",
							padding: "5px 10px",
							borderRadius: "4px",
							cursor: "pointer",
						}}
					>
						Source: {currentSource === "vidsrc" ? "VidSrc" : "2Embed"}
					</button>
				</div>
			)}

			{/* Debug info (only visible in development) */}
			{process.env.NODE_ENV === "development" && (
				<div
					className="video-player__debug"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						background: "rgba(0, 0, 0, 0.7)",
						color: "#00ff00",
						padding: "5px",
						fontSize: "10px",
						fontFamily: "monospace",
						zIndex: 100,
						maxWidth: "300px",
						wordBreak: "break-all",
					}}
				>
					<div>Type: {type}</div>
					<div>ID: {id}</div>
					<div>Source: {currentSource}</div>
					<div>URL: {getSourceUrl()}</div>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
