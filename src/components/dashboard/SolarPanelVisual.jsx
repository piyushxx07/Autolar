import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { Clock3, Compass, Sun } from 'lucide-react';

const SolarPanelVisual = ({ latestTelemetry, isOnline }) => {
  const hasPan = latestTelemetry?.servoPan != null;
  const hasTilt = latestTelemetry?.servoTilt != null;
  const updatedAt = latestTelemetry?.recordedAt ? new Date(latestTelemetry.recordedAt) : null;
  const panAngle = Number(latestTelemetry?.servoPan || 0);
  const tiltAngle = Number(latestTelemetry?.servoTilt || 0);

  return (
    <Card className="tracker-position-card h-100">
      <Card.Body>
        <div className="tracker-card-heading">
          <div><span className="tracker-card-kicker">Device position</span><h2>{latestTelemetry?.deviceId || 'Tracker'}</h2></div>
          <div className="tracker-status-badges">
            <Badge className={`tracker-live-badge${isOnline ? ' online' : ' offline'}`}><span />{isOnline ? 'Online' : 'Offline'}</Badge>
            {latestTelemetry?.operatingMode && <Badge className={`tracker-live-badge tracker-mode-badge${String(latestTelemetry.operatingMode).toUpperCase() === 'TRACKING' ? ' is-mode-active' : ''}`}><span />{latestTelemetry.operatingMode}</Badge>}
          </div>
        </div>
        <div className="tracker-position-main">
          <div className="tracker-angle-grid">
            <div className="tracker-angle">
              <span><Compass size={15} />Pan</span>
              <strong>{hasPan ? `${latestTelemetry.servoPan}°` : '—'}</strong>
            </div>
            <div className="tracker-angle">
              <span><Compass size={15} />Tilt</span>
              <strong>{hasTilt ? `${latestTelemetry.servoTilt}°` : '—'}</strong>
            </div>
          </div>
          <div className={`tracker-solar-art${isOnline ? ' online' : ' offline'}`} aria-label={`Solar tracker illustration, device ${isOnline ? 'online' : 'offline'}`}>
            <Sun className="tracker-sun-icon" size={74} strokeWidth={1.35} />
            <div className="tracker-panel-mount">
              <div className="solar-panel-illustration" style={{ '--panel-tilt': `${Math.min(Math.max(tiltAngle, -30), 30)}deg`, '--panel-pan': `${Math.min(Math.max((panAngle - 90) / 3, -30), 30)}deg` }}>
                {Array.from({ length: 8 }, (_, index) => <div key={index} />)}
              </div>
              <span className="tracker-mount-neck" />
              <span className="tracker-mount-post" />
              <span className="tracker-mount-base" />
            </div>
          </div>
        </div>
        <div className="tracker-reading-time"><Clock3 size={14} />{updatedAt ? `${isOnline ? 'Last updated' : 'Last reading'} · ${updatedAt.toLocaleString()}` : 'No telemetry has been received yet'}</div>
      </Card.Body>
    </Card>
  );
};

export default SolarPanelVisual;
