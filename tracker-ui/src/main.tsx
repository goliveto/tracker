import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import App from './App.tsx'
import Tracker from './components/Tracker.tsx';
import ListTracker from './components/ListTracker.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/trackers/:id" element={<Tracker />} />
      <Route path="/trackers/new" element={<Tracker />} />
      <Route path="/trackers" element={<ListTracker />} />
    </Routes>
  </BrowserRouter>
)
