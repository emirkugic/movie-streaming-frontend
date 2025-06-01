# Araneum Streaming Platform Frontend

![Araneum Streaming Logo](public/logo-long-white.png)

A beautiful, modern streaming platform frontend built with React. This project provides a Netflix-inspired user interface for browsing and watching movies and TV shows.

## 🌟 Features

- **Modern UI** - Sleek dark theme with elegant animations and transitions
- **Responsive Design** - Fully responsive layout that works on all devices
- **Movie & TV Show Browsing** - Browse trending movies and TV shows
- **Media Player** - Integrated video player with multiple source options
- **User Accounts** - Login, registration, and profile management
- **Personal Lists** - Watchlist, favorites, and watch history functionality
- **Search** - Powerful search functionality to find content

## 🔧 Tech Stack

- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **SASS/SCSS** - Styling
- **Axios** - API requests
- **React Icons** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/emirkugic/movie-streaming-frontend.git
cd movie-streaming-frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start development server

```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
src/
├── assets/         # Static assets and styles
├── components/     # Reusable UI components
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux store and slices
├── utils/          # Utility functions
├── App.js          # Main app component
└── index.js        # Entry point
```

## 🔌 API Integration

This frontend works with the [Araneum Streaming API](https://github.com/emirkugic/araneum-streaming-api) backend. Make sure to set up and run the backend service for full functionality.

The backend provides:

- User authentication
- Movie and TV show data
- Search functionality
- User preferences and lists

## 📱 Responsive Design

The UI is designed to work seamlessly across different devices:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (992px+)
- Large screens (1200px+)

## 🎨 UI Components

- **Header** - Navigation bar with search and user menu
- **Hero Slider** - Featured content showcase
- **Media Cards** - Interactive cards for movies and TV shows
- **Media Grid** - Responsive grid layout for content
- **Video Player** - Integrated player with source options
- **Profile Section** - User profile management
- **Footer** - Site information and links

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
