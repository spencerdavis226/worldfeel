
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Catch-all route redirects to home */}
        <Route path="*" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
