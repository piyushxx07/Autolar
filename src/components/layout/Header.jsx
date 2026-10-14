import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDevice } from '../../context/DeviceContext';
import useLatestTelemetry from '../../hooks/useLatestTelemetry';
import { formatTimeAgo } from '../../utils/formatters';
import { Navbar, Dropdown } from 'react-bootstrap';
import { Bell, UserRound, LogOut, Gamepad2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { deviceId } = useDevice();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: latestTelemetry, isOnline } = useLatestTelemetry(deviceId);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <Navbar className="autolar-header">
      <div className="header-inner">
        <Link to="/dashboard" className="navbar-brand autolar-brand" aria-label="AutoLar dashboard">
          <span className="brand-mark" aria-hidden="true"><img className="autolar-logo-mark" src="/logo.png" alt="" /></span>
          <span className="brand-copy"><small>Solar Tracking System</small></span>
        </Link>

        <div className="header-actions">
          <div className="header-status" aria-live="polite">
            {isOnline ? <><span className="status-pill is-online"><span className="status-dot" />Online</span><small className="text-muted d-none d-xl-inline">Updated {formatTimeAgo(latestTelemetry.recordedAt)}</small></> : <span className="status-pill is-offline"><span className="status-dot" />Offline</span>}
            {latestTelemetry?.operatingMode && <span className={`status-pill is-mode${String(latestTelemetry.operatingMode).toUpperCase() === 'TRACKING' ? ' is-mode-active' : ''}`}><span className="status-dot" />{latestTelemetry.operatingMode}</span>}
          </div>

          <div className="header-icon-actions">
            <Link to="/notifications" className="header-icon-button header-notification-action" aria-label="Notifications"><Bell size={18} /></Link>
            <Dropdown align="end">
              <Dropdown.Toggle className="header-icon-button header-profile-action" aria-label={`Account menu${user?.name ? ` for ${user.name}` : ''}`}><UserRound size={18} /></Dropdown.Toggle>
              <Dropdown.Menu className="account-menu">
                <Dropdown.Item onClick={() => navigate('/device-control')}><Gamepad2 size={16} />Device control</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/settings')}><Settings size={16} />Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={signOut}><LogOut size={16} />Sign out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
