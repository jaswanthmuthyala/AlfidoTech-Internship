import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f0f0f0',
            border: '1px solid #333',
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#1a1a1a' } },
          error:   { iconTheme: { primary: '#ff4455', secondary: '#1a1a1a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
