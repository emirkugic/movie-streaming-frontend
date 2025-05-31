import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../../store/authSlice";
import { setSearchQuery, searchContent } from "../../store/searchSlice";
import "../../assets/styles/Header.scss";

const Header = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);

	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			dispatch(setSearchQuery(searchTerm));
			dispatch(searchContent(searchTerm));
			navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
			setShowSearch(false);
		}
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		setShowUserMenu(false);
	};

	return (
		<header className="header">
			<div className="header__container">
				<div className="header__logo">
					<Link to="/">
						<h1>Streaming</h1>
					</Link>
				</div>

				<nav className="header__nav">
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/movies">Movies</Link>
						</li>
						<li>
							<Link to="/tv-shows">TV Shows</Link>
						</li>
					</ul>
				</nav>

				<div className="header__actions">
					<button
						className="header__search-btn"
						onClick={() => setShowSearch(!showSearch)}
					>
						<FaSearch />
					</button>

					{isAuthenticated ? (
						<div className="header__user">
							<button
								className="header__user-btn"
								onClick={() => setShowUserMenu(!showUserMenu)}
							>
								<FaUser />
								<span className="header__username">{user?.name}</span>
							</button>

							{showUserMenu && (
								<div className="header__user-menu">
									<Link to="/profile" onClick={() => setShowUserMenu(false)}>
										Profile
									</Link>
									<Link to="/watchlist" onClick={() => setShowUserMenu(false)}>
										Watchlist
									</Link>
									<Link to="/favorites" onClick={() => setShowUserMenu(false)}>
										Favorites
									</Link>
									<Link
										to="/watch-history"
										onClick={() => setShowUserMenu(false)}
									>
										History
									</Link>
									<button onClick={handleLogout}>
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
							<Link to="/register" className="header__register-btn">
								Register
							</Link>
						</div>
					)}
				</div>
			</div>

			{showSearch && (
				<div className="header__search">
					<form onSubmit={handleSearch}>
						<input
							type="text"
							placeholder="Search for movies, TV shows..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							autoFocus
						/>
						<button type="submit">
							<FaSearch />
						</button>
					</form>
				</div>
			)}
		</header>
	);
};

export default Header;
