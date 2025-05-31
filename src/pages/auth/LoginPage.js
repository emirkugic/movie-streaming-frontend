import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../store/authSlice";
import "../../assets/styles/AuthPages.scss";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

		if (!email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			errors.email = "Email is invalid";
		}

		if (!password) {
			errors.password = "Password is required";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			dispatch(loginUser({ email, password }));
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<h1>Login</h1>

				<form onSubmit={handleSubmit} className="auth-form">
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

					{error && !error.errors && (
						<div className="form-error">
							<p>{error.message || "Login failed. Please try again."}</p>
						</div>
					)}

					<button type="submit" className="auth-button" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className="auth-links">
					<p>
						Don't have an account? <Link to="/register">Register</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
