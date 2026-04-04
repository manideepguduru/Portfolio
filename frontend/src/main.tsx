import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#e2e8f0',
            border: '1px solid rgba(99,179,237,0.2)',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#111827' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#111827' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
