import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Font Awesome configuration
import './fontawesome';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);