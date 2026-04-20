import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SettingsPage from './pages/SettingsPage';
import ContentPage from './pages/ContentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><PageTransition><ContentPage /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><PageTransition><AnalyticsPage /></PageTransition></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" 
               toastOptions={{
                 style: {
                   background: 'rgba(20, 20, 30, 0.9)',
                   backdropFilter: 'blur(10px)',
                   color: '#fff',
                   border: '1px solid rgba(139, 92, 246, 0.4)',
                   borderRadius: '12px',
                   boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                 }
               }}/>
      <div className="app-container">
        <Navbar />
        <div className="page-wrapper">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
