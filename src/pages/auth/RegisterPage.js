import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/authSlice";
import "../../assets/styles/AuthPages.scss";

const RegisterPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [formErrors, setFormErrors] = useState({});

	const { isAuthenticated, loading, error } = useSelector(
		(state) => state.auth
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		// Redirect if already authenticated
		if (isAuthenticated) {
			navigate("/");
		}

		// Clear errors when component unmounts
		return () => {
			dispatch(clearError());
		};
	}, [isAuthenticated, dispatch, navigate]);

	useEffect(() => {
		// Set form errors from API response
		if (error && error.errors) {
			setFormErrors(error.errors);
		}
	}, [error]);

	const validateForm = () => {
		const errors = {};

		if (!name.trim()) {
			errors.name = "Name is required";
		}

		if (!email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			errors.email = "Email is invalid";
		}

		if (!password) {
			errors.password = "Password is required";
		} else if (password.length < 8) {
			errors.password = "Password must be at least 8 characters";
		}

		if (password !== passwordConfirmation) {
			errors.password_confirmation = "Passwords do not match";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			dispatch(
				registerUser({
					name,
					email,
					password,
					password_confirmation: passwordConfirmation,
				})
			);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<h1>Register</h1>

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={formErrors.name ? "error" : ""}
						/>
						{formErrors.name && (
							<p className="error-message">{formErrors.name}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={formErrors.email ? "error" : ""}
						/>
						{formErrors.email && (
							<p className="error-message">{formErrors.email}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={formErrors.password ? "error" : ""}
						/>
						{formErrors.password && (
							<p className="error-message">{formErrors.password}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password_confirmation">Confirm Password</label>
						<input
							type="password"
							id="password_confirmation"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							className={formErrors.password_confirmation ? "error" : ""}
						/>
						{formErrors.password_confirmation && (
							<p className="error-message">
								{formErrors.password_confirmation}
							</p>
						)}
					</div>

					{error && !error.errors && (
						<div className="form-error">
							<p>{error.message || "Registration failed. Please try again."}</p>
						</div>
					)}

					<button type="submit" className="auth-button" disabled={loading}>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<div className="auth-links">
					<p>
						Already have an account? <Link to="/login">Login</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
