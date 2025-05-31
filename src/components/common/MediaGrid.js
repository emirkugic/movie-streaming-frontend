import React from "react";
import MediaCard from "./MediaCard";
import "../../assets/styles/MediaGrid.scss";

const MediaGrid = ({ items, type }) => {
	if (!items || items.length === 0) {
		return <p className="media-grid__empty">No items found.</p>;
	}

	return (
		<div className="media-grid">
			{items.map((item) => (
				<MediaCard key={item.id} media={item} type={type} />
			))}
		</div>
	);
};

export default MediaGrid;
