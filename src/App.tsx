import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { audioManager } from '@/utils/audioUtils';
import { useEffect } from 'react';
import Landing from '@/pages/Landing';
import Games from '@/pages/Games';
import Profile from '@/pages/Profile';
import ReviewPage from '@/pages/ReviewPage';

function App() {
  useEffect(() => {
    audioManager.initialize();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/games" element={<Games />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<ReviewPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
