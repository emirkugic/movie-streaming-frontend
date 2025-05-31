import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/Footer.scss";

const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer__container">
				<div className="footer__logo">
					<Link to="/">
						<h2>Streaming</h2>
					</Link>
					<p>Your personal streaming platform</p>
				</div>

				<div className="footer__links">
					<div className="footer__links-section">
						<h3>Browse</h3>
						<ul>
							<li>
								<Link to="/movies">Movies</Link>
							</li>
							<li>
								<Link to="/tv-shows">TV Shows</Link>
							</li>
							<li>
								<Link to="/movies/trending">Trending Movies</Link>
							</li>
							<li>
								<Link to="/tv-shows/trending">Trending TV Shows</Link>
							</li>
						</ul>
					</div>

					<div className="footer__links-section">
						<h3>Account</h3>
						<ul>
							<li>
								<Link to="/profile">Profile</Link>
							</li>
							<li>
								<Link to="/watchlist">Watchlist</Link>
							</li>
							<li>
								<Link to="/favorites">Favorites</Link>
							</li>
							<li>
								<Link to="/watch-history">History</Link>
							</li>
						</ul>
					</div>

					<div className="footer__links-section">
						<h3>Legal</h3>
						<ul>
							<li>
								<Link to="/terms">Terms of Use</Link>
							</li>
							<li>
								<Link to="/privacy">Privacy Policy</Link>
							</li>
							<li>
								<Link to="/disclaimer">Disclaimer</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="footer__bottom">
				<p>&copy; {year} Streaming.araneum.ba - All rights reserved</p>
				<p>This website is for educational purposes only.</p>
				<p>
					We do not host any content. All content is retrieved from external
					sources.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
