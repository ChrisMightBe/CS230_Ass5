import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TravelLogs from './pages/TravelLogs';
import JourneyPlans from './pages/JourneyPlans';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/travel-logs" element={isLoggedIn ? <TravelLogs /> : <Navigate to="/login" />} />
        <Route path="/journey-plans" element={isLoggedIn ? <JourneyPlans /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;