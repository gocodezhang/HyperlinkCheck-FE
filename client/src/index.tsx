import React from 'react';
import { createRoot } from 'react-dom/client'
import SideBar from './components/SideBar';


const root = createRoot(document.getElementById('side-bar') as HTMLElement);
root.render(
  <React.StrictMode>
    <SideBar />
  </React.StrictMode>
);