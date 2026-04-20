import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerApp from './CustomerApp';
import AdminApp from './admin/AdminApp';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<CustomerApp />} />
        </Routes>
      </Router>
      <Analytics />
    </HelmetProvider>
  );
};

export default App;