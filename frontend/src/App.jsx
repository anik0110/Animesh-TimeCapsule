import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Themes from './pages/Themes';
import Recipients from './pages/Recipients';
import Profile from './pages/Profile';
import Events from './pages/Events';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;