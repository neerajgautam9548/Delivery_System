import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlaySquare, BarChart2, Settings, LogOut, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('System disconnected');
    navigate('/login');
  };

  if (!token) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Engine', path: '/content', icon: PlaySquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Zap color="var(--accent-blue)" size={28} />
        <h2>MORPHIX<span style={{color: 'var(--accent-purple)'}}></span></h2>
      </div>
      
      <div className="nav-links">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <NavLink key={link.name} to={link.path} className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /> {link.name}
              {isActive && (
                <motion.div layoutId="nav-indicator" className="nav-indicator" />
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="nav-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div className="status-indicator" style={{ background: 'var(--accent-green)', boxShadow: '0 0 10px var(--accent-green)' }}></div>
          System Online
        </div>
        <button onClick={handleLogout} className="btn-icon" title="Logout">
          <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
