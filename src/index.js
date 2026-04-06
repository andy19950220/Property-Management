import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill window.storage (replaces Vercel v0 storage API with localStorage)
if (!window.storage) {
  window.storage = {
    get: (key) => {
      const value = localStorage.getItem(key);
      return Promise.resolve(value ? { value } : {});
    },
    set: (key, value) => {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    delete: (key) => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
