// src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaYoutube,
	FaEnvelope,
	FaPhoneAlt,
	FaMapMarkerAlt,
} from "react-icons/fa";
import "../../assets/styles/Footer.scss";

const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer__top">
				<div className="container">
					<div className="footer__grid">
						<div className="footer__brand">
							<Link to="/" className="footer__logo">
								<span className="footer__logo-text">Araneum</span>
								<span className="footer__logo-dot"></span>
								<span className="footer__logo-small">Stream</span>
							</Link>
							<p className="footer__tagline">
								Your personal streaming platform with the best movies and TV
								shows.
							</p>
							<div className="footer__social">
								<a
									href="#"
									className="footer__social-link"
									aria-label="Facebook"
								>
									<FaFacebookF />
								</a>
								<a
									href="#"
									className="footer__social-link"
									aria-label="Twitter"
								>
									<FaTwitter />
								</a>
								<a
									href="#"
									className="footer__social-link"
									aria-label="Instagram"
								>
									<FaInstagram />
								</a>
								<a
									href="#"
									className="footer__social-link"
									aria-label="YouTube"
								>
									<FaYoutube />
								</a>
							</div>
						</div>

						<div className="footer__links">
							<h3 className="footer__heading">Quick Links</h3>
							<ul className="footer__list">
								<li>
									<Link to="/">Home</Link>
								</li>
								<li>
									<Link to="/movies">Movies</Link>
								</li>
								<li>
									<Link to="/tv-shows">TV Shows</Link>
								</li>
								<li>
									<Link to="/search">Search</Link>
								</li>
							</ul>
						</div>

						<div className="footer__links">
							<h3 className="footer__heading">My Account</h3>
							<ul className="footer__list">
								<li>
									<Link to="/profile">Profile</Link>
								</li>
								<li>
									<Link to="/watchlist">My List</Link>
								</li>
								<li>
									<Link to="/favorites">Favorites</Link>
								</li>
								<li>
									<Link to="/watch-history">Watch History</Link>
								</li>
							</ul>
						</div>

						<div className="footer__links">
							<h3 className="footer__heading">Support</h3>
							<ul className="footer__list">
								<li>
									<Link to="/faq">FAQ</Link>
								</li>
								<li>
									<Link to="/help">Help Center</Link>
								</li>
								<li>
									<Link to="/terms">Terms of Service</Link>
								</li>
								<li>
									<Link to="/privacy">Privacy Policy</Link>
								</li>
							</ul>
						</div>

						<div className="footer__contact">
							<h3 className="footer__heading">Contact Us</h3>
							<ul className="footer__contact-list">
								<li>
									<FaEnvelope />
									<span>info@araneum.ba</span>
								</li>
								<li>
									<FaPhoneAlt />
									<span>+387 62 123 456</span>
								</li>
								<li>
									<FaMapMarkerAlt />
									<span>Sarajevo, Bosnia and Herzegovina</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="footer__bottom">
				<div className="container">
					<div className="footer__copyright">
						<p>&copy; {year} Araneum Stream. All rights reserved.</p>
						<p className="footer__disclaimer">
							This website is for educational purposes only. We don't store any
							media files on our server.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
