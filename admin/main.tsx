import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminApp from './AdminApp';

const root = createRoot(document.getElementById('root')!);
root.render(<AdminApp />);
