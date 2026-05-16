import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './index.css';
import axios from 'axios';
import { getApiUrl } from './config/api.js';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = getApiUrl().replace(/\/api\/?$/, '') || 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);