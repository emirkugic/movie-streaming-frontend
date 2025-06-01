// src/components/layout/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import { setSearchQuery, searchContent } from "../../store/searchSlice";
import {
	FaSearch,
	FaUserCircle,
	FaSignOutAlt,
	FaHistory,
	FaHeart,
	FaList,
	FaCog,
	FaBars,
	FaTimes,
} from "react-icons/fa";
import "../../assets/styles/Header.scss";

const Header = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Handle scroll effect for header background
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu on route change
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			dispatch(setSearchQuery(searchTerm));
			dispatch(searchContent(searchTerm));
			navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
			setShowSearch(false);
			setSearchTerm("");
		}
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		setShowUserMenu(false);
		navigate("/");
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
		// Prevent scrolling when menu is open
		document.body.classList.toggle("no-scroll", !mobileMenuOpen);
	};

	return (
		<header className={`header ${scrolled ? "header--scrolled" : ""}`}>
			<div className="header__container">
				<div className="header__left">
					<Link to="/" className="header__logo">
						<span className="header__logo-text">Araneum</span>
						<span className="header__logo-dot"></span>
						<span className="header__logo-small">Stream</span>
					</Link>

					<nav
						className={`header__nav ${
							mobileMenuOpen ? "header__nav--active" : ""
						}`}
					>
						<button className="header__close-menu" onClick={toggleMobileMenu}>
							<FaTimes />
						</button>
						<ul className="header__nav-list">
							<li className={location.pathname === "/" ? "active" : ""}>
								<Link to="/">Home</Link>
							</li>
							<li
								className={
									location.pathname.includes("/movies") ? "active" : ""
								}
							>
								<Link to="/movies">Movies</Link>
							</li>
							<li
								className={
									location.pathname.includes("/tv-shows") ? "active" : ""
								}
							>
								<Link to="/tv-shows">TV Shows</Link>
							</li>
							{isAuthenticated && (
								<>
									<li
										className={
											location.pathname === "/watchlist" ? "active" : ""
										}
									>
										<Link to="/watchlist">My List</Link>
									</li>
								</>
							)}
						</ul>
					</nav>
				</div>

				<div className="header__right">
					<button
						className={`header__search-toggle ${showSearch ? "active" : ""}`}
						onClick={() => setShowSearch(!showSearch)}
						aria-label="Toggle search"
					>
						<FaSearch />
					</button>

					{isAuthenticated ? (
						<div className="header__user">
							<button
								className="header__user-btn"
								onClick={() => setShowUserMenu(!showUserMenu)}
								aria-label="User menu"
							>
								<span className="header__avatar">
									{user?.name?.charAt(0) || <FaUserCircle />}
								</span>
								<span className="header__username">{user?.name}</span>
							</button>

							{showUserMenu && (
								<div className="header__user-menu">
									<Link to="/profile" onClick={() => setShowUserMenu(false)}>
										<FaUserCircle /> Profile
									</Link>
									<Link to="/watchlist" onClick={() => setShowUserMenu(false)}>
										<FaList /> My List
									</Link>
									<Link to="/favorites" onClick={() => setShowUserMenu(false)}>
										<FaHeart /> Favorites
									</Link>
									<Link
										to="/watch-history"
										onClick={() => setShowUserMenu(false)}
									>
										<FaHistory /> History
									</Link>
									<Link to="/settings" onClick={() => setShowUserMenu(false)}>
										<FaCog /> Settings
									</Link>
									<button onClick={handleLogout} className="header__logout-btn">
										<FaSignOutAlt /> Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="header__auth">
							<Link to="/login" className="header__login-btn">
								Login
							</Link>
							<Link to="/register" className="header__register-btn btn">
								Sign Up
							</Link>
						</div>
					)}

					<button
						className="header__mobile-toggle"
						onClick={toggleMobileMenu}
						aria-label="Toggle mobile menu"
					>
						<FaBars />
					</button>
				</div>
			</div>

			{showSearch && (
				<div className="header__search">
					<div className="container">
						<form onSubmit={handleSearch}>
							<input
								type="text"
								placeholder="Search for movies, TV shows, actors..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
							<button type="submit">
								<FaSearch />
							</button>
						</form>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
