import axios from 'axios';

// Attach JWT to all axios requests if present
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('jwt');
		if (token) {
			config.headers = config.headers || {};
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
