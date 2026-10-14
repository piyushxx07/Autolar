import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Activity, BarChart3, BatteryCharging, Bell, Bot, Gamepad2, Home, Menu, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TextRevealLabel from '../common/TextRevealLabel';

const MobileNav = () => {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const analysisRef = useRef(null);
  const isAnalysisPage = ['/analytics', '/energy-history'].includes(pathname);
  const isAccountPage = ['/settings', '/device-control'].includes(pathname);

  useEffect(() => {
    setAnalysisOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!analysisOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!analysisRef.current?.contains(event.target)) setAnalysisOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setAnalysisOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [analysisOpen]);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <nav className="mobile-bottom-nav" aria-label="Main navigation">
      <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
        <Home size={20} /><span>Home</span>
      </NavLink>
      <div className="mobile-analysis-wrap" ref={analysisRef}>
        <button type="button" className={`mobile-nav-link${analysisOpen || isAnalysisPage ? ' active' : ''}`} aria-label="Analysis" aria-expanded={analysisOpen} aria-haspopup="menu" onClick={() => setAnalysisOpen((open) => !open)}>
          <Activity size={20} /><TextRevealLabel>Analysis</TextRevealLabel>
        </button>
        {analysisOpen && <div className="mobile-nav-popover" role="menu">
          <Link role="menuitem" aria-label="Analytics" to="/analytics" onClick={() => setAnalysisOpen(false)}><BarChart3 size={17} /><TextRevealLabel>Analytics</TextRevealLabel></Link>
          <Link role="menuitem" aria-label="Energy history" to="/energy-history" onClick={() => setAnalysisOpen(false)}><BatteryCharging size={17} /><TextRevealLabel>Energy history</TextRevealLabel></Link>
        </div>}
      </div>
      <NavLink to="/assistant" className={({ isActive }) => `mobile-nav-link mobile-nav-ai${isActive ? ' active' : ''}`}>
        <span className="mobile-ai-icon"><Bot size={21} /></span><span>AI</span>
      </NavLink>
      <NavLink to="/notifications" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
        <span className="mobile-bell-icon"><Bell size={20} /></span><span>Alerts</span>
      </NavLink>
      <Dropdown drop="up" align="end" className={`mobile-profile-wrap${isAccountPage ? ' active' : ''}`}>
        <Dropdown.Toggle className={`mobile-nav-link mobile-menu-toggle${isAccountPage ? ' active' : ''}`} aria-label="More options"><Menu size={21} /><span>More</span></Dropdown.Toggle>
        <Dropdown.Menu className="account-menu mobile-account-menu">
          <Dropdown.Item onClick={() => navigate('/device-control')}><Gamepad2 size={16} />Device control</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/settings')}><Settings size={16} />Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={signOut}><LogOut size={16} />Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
};

export default MobileNav;
