// src/layouts/MainLayout/MainLayout.js
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { FaArrowUp } from "react-icons/fa";
import "./MainLayout.scss";

const MainLayout = () => {
	const location = useLocation();
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);

	// Detect scroll position for scroll-to-top button
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 300);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Scroll to top on route change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	// Set page loaded status
	useEffect(() => {
		setPageLoaded(true);
	}, []);

	// Handle scroll to top
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div className={`main-layout ${pageLoaded ? "loaded" : ""}`}>
			<Header />

			<main className="main-content">
				<Outlet />
			</main>

			<Footer />

			{showScrollTop && (
				<button
					className="scroll-top-btn"
					onClick={scrollToTop}
					aria-label="Scroll to top"
				>
					<FaArrowUp />
				</button>
			)}
		</div>
	);
};

export default MainLayout;
