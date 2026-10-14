import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { LayoutDashboard, BarChart3, BatteryCharging, Bot } from 'lucide-react';
import TextRevealLabel from '../common/TextRevealLabel';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Energy History', path: '/energy-history', icon: BatteryCharging },
    { name: 'Assistant', path: '/assistant', icon: Bot },
  ];

  const renderNavLinks = () => (
    <Nav className="flex-column w-100 sidebar-nav">
      <div className="text-muted small fw-bold px-3 mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Menu</div>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            aria-label={item.name}
            className={({ isActive }) => `nav-link text-decoration-none ${isActive ? 'active-sidebar-item' : ''}`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="ms-2"><TextRevealLabel>{item.name}</TextRevealLabel></span>
          </NavLink>
        );
      })}
    </Nav>
  );

  return <div className="d-none d-lg-flex sidebar">{renderNavLinks()}</div>;
};

export default Sidebar;
