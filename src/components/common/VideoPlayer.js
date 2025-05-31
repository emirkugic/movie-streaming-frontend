import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { updateWatchProgress } from "../../store/userSlice";
import {
	FaPlay,
	FaPause,
	FaVolumeUp,
	FaVolumeMute,
	FaExpand,
} from "react-icons/fa";
import "../../assets/styles/VideoPlayer.scss";

const VideoPlayer = ({ sources, type, id }) => {
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(0.7);
	const [muted, setMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentSource, setCurrentSource] = useState("vidsrc");
	const [showControls, setShowControls] = useState(true);
	const [loading, setLoading] = useState(true);

	const { isAuthenticated } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const playerRef = useRef(null);
	const playerContainerRef = useRef(null);
	const controlsTimeoutRef = useRef(null);

	useEffect(() => {
		// Hide controls after inactivity
		const handleMouseMove = () => {
			setShowControls(true);

			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}

			controlsTimeoutRef.current = setTimeout(() => {
				if (playing) {
					setShowControls(false);
				}
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
	}, [playing]);

	useEffect(() => {
		// Save watch progress every 5 seconds
		const interval = setInterval(() => {
			if (isAuthenticated && playing && progress > 0) {
				saveWatchProgress();
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [isAuthenticated, playing, progress]);

	// Load saved progress when component mounts
	useEffect(() => {
		if (isAuthenticated && playerRef.current) {
			// Here you would fetch the saved progress from your API
			// For now, we'll just assume starting from the beginning
		}
	}, [isAuthenticated]);

	const handlePlay = () => {
		setPlaying(true);
	};

	const handlePause = () => {
		setPlaying(false);
	};

	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		setMuted(newVolume === 0);
	};

	const handleToggleMute = () => {
		setMuted(!muted);
	};

	const handleProgress = (state) => {
		setProgress(state.playedSeconds);
	};

	const handleDuration = (duration) => {
		setDuration(duration);
	};

	const handleSeek = (e) => {
		const seekTime = parseFloat(e.target.value);
		setProgress(seekTime);
		playerRef.current.seekTo(seekTime);
	};

	const handleFullScreen = () => {
		const playerContainer = playerContainerRef.current;

		if (playerContainer) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				playerContainer.requestFullscreen();
			}
		}
	};

	const saveWatchProgress = () => {
		if (!isAuthenticated || !duration) return;

		const percentWatched = (progress / duration) * 100;
		const completed = percentWatched > 90; // Consider completed if watched more than 90%

		dispatch(
			updateWatchProgress({
				type: type === "movie" ? "movie" : "episode",
				id,
				progress: Math.floor(progress),
				completed,
			})
		);
	};

	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		return [
			hours > 0 ? hours : null,
			minutes < 10 && hours > 0 ? `0${minutes}` : minutes,
			secs < 10 ? `0${secs}` : secs,
		]
			.filter(Boolean)
			.join(":");
	};

	const handleSourceChange = (source) => {
		setCurrentSource(source);
		setLoading(true);
	};

	return (
		<div className="video-player" ref={playerContainerRef}>
			<ReactPlayer
				ref={playerRef}
				url={sources[currentSource]}
				playing={playing}
				volume={volume}
				muted={muted}
				width="100%"
				height="100%"
				onPlay={handlePlay}
				onPause={handlePause}
				onProgress={handleProgress}
				onDuration={handleDuration}
				onBuffer={() => setLoading(true)}
				onBufferEnd={() => setLoading(false)}
				onReady={() => setLoading(false)}
				config={{
					file: {
						attributes: {
							crossOrigin: "anonymous",
						},
					},
				}}
				style={{ position: "absolute", top: 0, left: 0 }}
			/>

			{loading && (
				<div className="video-player__loader">
					<div className="video-player__spinner"></div>
				</div>
			)}

			{showControls && (
				<div className="video-player__controls">
					<div className="video-player__progress">
						<input
							type="range"
							min={0}
							max={duration}
							value={progress}
							onChange={handleSeek}
							className="video-player__progress-bar"
						/>
					</div>

					<div className="video-player__buttons">
						<div className="video-player__left">
							<button
								className="video-player__play-pause"
								onClick={playing ? handlePause : handlePlay}
							>
								{playing ? <FaPause /> : <FaPlay />}
							</button>

							<div className="video-player__volume">
								<button
									className="video-player__mute"
									onClick={handleToggleMute}
								>
									{muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
								</button>

								<input
									type="range"
									min={0}
									max={1}
									step={0.1}
									value={muted ? 0 : volume}
									onChange={handleVolumeChange}
									className="video-player__volume-slider"
								/>
							</div>

							<div className="video-player__time">
								<span>{formatTime(progress)}</span>
								<span> / </span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>

						<div className="video-player__right">
							<div className="video-player__source-selector">
								<select
									value={currentSource}
									onChange={(e) => handleSourceChange(e.target.value)}
									className="video-player__source-select"
								>
									<option value="vidsrc">Source 1 (VidSrc)</option>
									<option value="2embed">Source 2 (2Embed)</option>
								</select>
							</div>

							<button
								className="video-player__fullscreen"
								onClick={handleFullScreen}
							>
								<FaExpand />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
