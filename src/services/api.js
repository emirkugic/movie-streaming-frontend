import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
	baseURL,
	withCredentials: true,
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// API modules
export const authAPI = {
	register: (userData) => api.post("/register", userData),
	login: (credentials) => api.post("/login", credentials),
	logout: () => api.post("/logout"),
	getUser: () => api.get("/user"),
};

export const moviesAPI = {
	getAll: (page = 1) => api.get(`/movies?page=${page}`),
	getTrending: (page = 1) => api.get(`/movies/trending?page=${page}`),
	getUpcoming: (page = 1) => api.get(`/movies/upcoming?page=${page}`),
	getMovie: (slug) => api.get(`/movies/${slug}`),
};

export const tvShowsAPI = {
	getAll: (page = 1) => api.get(`/tv-shows?page=${page}`),
	getTrending: (page = 1) => api.get(`/tv-shows/trending?page=${page}`),
	getTvShow: (slug) => api.get(`/tv-shows/${slug}`),
	getSeason: (slug, seasonNumber) =>
		api.get(`/tv-shows/${slug}/season/${seasonNumber}`),
	getEpisode: (slug, seasonNumber, episodeNumber) =>
		api.get(
			`/tv-shows/${slug}/season/${seasonNumber}/episode/${episodeNumber}`
		),
};

export const genresAPI = {
	getAll: () => api.get("/genres"),
	getByType: (type) => api.get(`/genres/${type}`),
	getGenre: (id) => api.get(`/genre/${id}`),
};

export const searchAPI = {
	search: (query) => api.get(`/search?query=${encodeURIComponent(query)}`),
};

export const watchlistAPI = {
	getWatchlist: () => api.get("/watchlist"),
	addToWatchlist: (type, id) => api.post("/watchlist/add", { type, id }),
	removeFromWatchlist: (type, id) =>
		api.post("/watchlist/remove", { type, id }),
	checkWatchlist: (type, id) => api.post("/watchlist/check", { type, id }),
};

export const favoritesAPI = {
	getFavorites: () => api.get("/favorites"),
	addToFavorites: (type, id) => api.post("/favorites/add", { type, id }),
	removeFromFavorites: (type, id) =>
		api.post("/favorites/remove", { type, id }),
	checkFavorite: (type, id) => api.post("/favorites/check", { type, id }),
};

export const watchHistoryAPI = {
	getWatchHistory: () => api.get("/watch-history"),
	updateWatchHistory: (type, id, progress, completed) =>
		api.post("/watch-history/update", { type, id, progress, completed }),
	getWatchProgress: (type, id) => api.post("/watch-history/get", { type, id }),
	deleteWatchHistory: (type, id) =>
		api.post("/watch-history/delete", { type, id }),
};

export default api;
