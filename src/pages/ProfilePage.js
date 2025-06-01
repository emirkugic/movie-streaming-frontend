// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
	FaUser,
	FaEnvelope,
	FaCalendarAlt,
	FaEdit,
	FaLock,
	FaEye,
	FaEyeSlash,
	FaCheck,
	FaTrash,
	FaHistory,
	FaHeart,
	FaList,
	FaCog,
} from "react-icons/fa";
import "../assets/styles/ProfilePage.scss";

const ProfilePage = () => {
	const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

	// Tabs state
	const [activeTab, setActiveTab] = useState("profile");

	// Profile form state
	const [profileForm, setProfileForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
		bio: user?.bio || "",
	});

	// Password form state
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// UI states
	const [editMode, setEditMode] = useState(false);
	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Update form when user data changes
	useEffect(() => {
		if (user) {
			setProfileForm({
				name: user.name || "",
				email: user.email || "",
				bio: user.bio || "",
			});
		}
	}, [user]);

	// Clear messages after 5 seconds
	useEffect(() => {
		if (successMessage || errorMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage("");
				setErrorMessage("");
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [successMessage, errorMessage]);

	// Redirect if not authenticated
	if (!isAuthenticated && !loading) {
		return <Navigate to="/login" />;
	}

	// Handle profile form changes
	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfileForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle password form changes
	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Toggle password visibility
	const togglePasswordVisibility = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	// Handle profile form submission
	const handleProfileSubmit = (e) => {
		e.preventDefault();

		// In a real app, dispatch an action to update the profile
		console.log("Profile update:", profileForm);

		// Simulate success
		setSuccessMessage("Profile updated successfully!");
		setEditMode(false);
	};

	// Handle password form submission
	const handlePasswordSubmit = (e) => {
		e.preventDefault();

		// Validate passwords
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		// In a real app, dispatch an action to change the password
		console.log("Password change:", passwordForm);

		// Simulate success
		setSuccessMessage("Password changed successfully!");
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	// Handle account deletion
	const handleDeleteAccount = () => {
		if (
			window.confirm(
				"Are you sure you want to delete your account? This action cannot be undone."
			)
		) {
			// In a real app, dispatch an action to delete the account
			console.log("Delete account");
		}
	};

	// Render the profile tab content
	const renderProfileTab = () => (
		<div className="profile-tab">
			<div className="profile-header">
				<div className="profile-avatar">
					{user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
				</div>
				<h2 className="profile-name">{user?.name || "User"}</h2>
				<p className="profile-since">
					<FaCalendarAlt /> Member since {new Date().getFullYear()}
				</p>
			</div>

			{successMessage && (
				<div className="profile-message profile-message--success">
					<FaCheck /> {successMessage}
				</div>
			)}

			{errorMessage && (
				<div className="profile-message profile-message--error">
					{errorMessage}
				</div>
			)}

			<div className="profile-form-container">
				<div className="profile-form-header">
					<h3>Profile Information</h3>
					<button
						className="profile-edit-toggle"
						onClick={() => setEditMode(!editMode)}
					>
						<FaEdit /> {editMode ? "Cancel" : "Edit Profile"}
					</button>
				</div>

				{editMode ? (
					<form className="profile-form" onSubmit={handleProfileSubmit}>
						<div className="form-group">
							<label htmlFor="name">
								<FaUser /> Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={profileForm.name}
								onChange={handleProfileChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="email">
								<FaEnvelope /> Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={profileForm.email}
								onChange={handleProfileChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="bio">Bio</label>
							<textarea
								id="bio"
								name="bio"
								value={profileForm.bio}
								onChange={handleProfileChange}
								rows="4"
								placeholder="Tell us about yourself..."
							></textarea>
						</div>

						<div className="form-actions">
							<button type="submit" className="btn">
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className="profile-info">
						<div className="profile-info-item">
							<div className="profile-info-label">
								<FaUser /> Name
							</div>
							<div className="profile-info-value">{profileForm.name}</div>
						</div>

						<div className="profile-info-item">
							<div className="profile-info-label">
								<FaEnvelope /> Email
							</div>
							<div className="profile-info-value">{profileForm.email}</div>
						</div>

						{profileForm.bio && (
							<div className="profile-info-item">
								<div className="profile-info-label">Bio</div>
								<div className="profile-info-value">{profileForm.bio}</div>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="profile-form-container">
				<div className="profile-form-header">
					<h3>Change Password</h3>
				</div>

				<form className="profile-form" onSubmit={handlePasswordSubmit}>
					<div className="form-group">
						<label htmlFor="currentPassword">
							<FaLock /> Current Password
						</label>
						<div className="password-input-wrapper">
							<input
								type={showPassword.current ? "text" : "password"}
								id="currentPassword"
								name="currentPassword"
								value={passwordForm.currentPassword}
								onChange={handlePasswordChange}
								required
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => togglePasswordVisibility("current")}
							>
								{showPassword.current ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="newPassword">
							<FaLock /> New Password
						</label>
						<div className="password-input-wrapper">
							<input
								type={showPassword.new ? "text" : "password"}
								id="newPassword"
								name="newPassword"
								value={passwordForm.newPassword}
								onChange={handlePasswordChange}
								required
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => togglePasswordVisibility("new")}
							>
								{showPassword.new ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">
							<FaLock /> Confirm New Password
						</label>
						<div className="password-input-wrapper">
							<input
								type={showPassword.confirm ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={passwordForm.confirmPassword}
								onChange={handlePasswordChange}
								required
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => togglePasswordVisibility("confirm")}
							>
								{showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<div className="form-actions">
						<button type="submit" className="btn">
							Change Password
						</button>
					</div>
				</form>
			</div>

			<div className="profile-danger-zone">
				<h3>Danger Zone</h3>
				<p>
					Once you delete your account, there is no going back. Please be
					certain.
				</p>
				<button className="btn btn-danger" onClick={handleDeleteAccount}>
					<FaTrash /> Delete Account
				</button>
			</div>
		</div>
	);

	// Render placeholder content for other tabs
	const renderPlaceholderTab = (title) => (
		<div className="profile-tab profile-placeholder">
			<div className="profile-placeholder-icon">
				{title === "watchlist" && <FaList />}
				{title === "favorites" && <FaHeart />}
				{title === "history" && <FaHistory />}
				{title === "settings" && <FaCog />}
			</div>
			<h2>{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
			<p>This feature is coming soon!</p>
			<Link to="/" className="btn">
				Go to Homepage
			</Link>
		</div>
	);

	// Render content based on active tab
	const renderTabContent = () => {
		switch (activeTab) {
			case "profile":
				return renderProfileTab();
			case "watchlist":
				return renderPlaceholderTab("watchlist");
			case "favorites":
				return renderPlaceholderTab("favorites");
			case "history":
				return renderPlaceholderTab("history");
			case "settings":
				return renderPlaceholderTab("settings");
			default:
				return renderProfileTab();
		}
	};

	return (
		<div className="profile-page">
			<div className="container">
				<div className="profile-container">
					<div className="profile-sidebar">
						<ul className="profile-nav">
							<li className={activeTab === "profile" ? "active" : ""}>
								<button onClick={() => setActiveTab("profile")}>
									<FaUser /> Profile
								</button>
							</li>
							<li className={activeTab === "watchlist" ? "active" : ""}>
								<button onClick={() => setActiveTab("watchlist")}>
									<FaList /> My List
								</button>
							</li>
							<li className={activeTab === "favorites" ? "active" : ""}>
								<button onClick={() => setActiveTab("favorites")}>
									<FaHeart /> Favorites
								</button>
							</li>
							<li className={activeTab === "history" ? "active" : ""}>
								<button onClick={() => setActiveTab("history")}>
									<FaHistory /> Watch History
								</button>
							</li>
							<li className={activeTab === "settings" ? "active" : ""}>
								<button onClick={() => setActiveTab("settings")}>
									<FaCog /> Settings
								</button>
							</li>
						</ul>
					</div>

					<div className="profile-content">{renderTabContent()}</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
