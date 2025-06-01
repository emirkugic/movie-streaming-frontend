// src/components/common/MediaGrid.js
import React from "react";
import { Link } from "react-router-dom";
import MediaCard from "./MediaCard";
import Loader from "./Loader";
import { FaArrowRight } from "react-icons/fa";
import "../../assets/styles/MediaGrid.scss";

const MediaGrid = ({
	items = [],
	type = "movie",
	title = "",
	loading = false,
	error = null,
	viewAllLink = "",
	viewAllText = "View All",
	emptyMessage = "No items found.",
	skeleton = 6,
}) => {
	if (loading) {
		return (
			<div className="media-grid-container">
				{title && (
					<div className="media-grid__header">
						<h2 className="media-grid__title">{title}</h2>
						{viewAllLink && (
							<Link to={viewAllLink} className="media-grid__view-all">
								{viewAllText} <FaArrowRight />
							</Link>
						)}
					</div>
				)}
				<div className="media-grid skeleton-grid">
					{[...Array(skeleton)].map((_, index) => (
						<div className="media-grid__skeleton" key={index}>
							<div className="media-grid__skeleton-poster"></div>
							<div className="media-grid__skeleton-info">
								<div className="media-grid__skeleton-title"></div>
								<div className="media-grid__skeleton-year"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="media-grid-container">
				{title && <h2 className="media-grid__title">{title}</h2>}
				<div className="media-grid__error">
					<p>Something went wrong.</p>
					<button
						className="btn btn-secondary"
						onClick={() => window.location.reload()}
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!items || items.length === 0) {
		return (
			<div className="media-grid-container">
				{title && <h2 className="media-grid__title">{title}</h2>}
				<div className="media-grid__empty">
					<p>{emptyMessage}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="media-grid-container">
			{title && (
				<div className="media-grid__header">
					<h2 className="media-grid__title">{title}</h2>
					{viewAllLink && (
						<Link to={viewAllLink} className="media-grid__view-all">
							{viewAllText} <FaArrowRight />
						</Link>
					)}
				</div>
			)}
			<div className="media-grid">
				{items.map((item) => (
					<div className="media-grid__item" key={item.id}>
						<MediaCard media={item} type={type} />
					</div>
				))}
			</div>
		</div>
	);
};

export default MediaGrid;
