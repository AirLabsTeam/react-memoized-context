import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { UsersTeams } from './UsersTeams/UsersTeams';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <UsersTeams />
  </React.StrictMode>,
);
