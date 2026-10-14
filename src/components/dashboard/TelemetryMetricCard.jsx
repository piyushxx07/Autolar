import React from 'react';
import { Card } from 'react-bootstrap';

const TelemetryMetricCard = ({ title, value, unit = '', isOnline, icon: Icon }) => (
  <Card className="h-100">
    <Card.Body className="telemetry-metric-body">
      <div className="telemetry-metric-heading">
        {Icon && <span className="telemetry-metric-icon"><Icon size={18} strokeWidth={1.9} /></span>}
        <span className="text-muted fw-semibold small text-uppercase">{title}</span>
      </div>
      <div className="telemetry-metric-value">
        {value !== null && value !== undefined ? <><strong>{value}</strong>{unit && <span>{unit}</span>}</> : <span className="telemetry-not-reported">Not reported</span>}
      </div>
      {!isOnline && value !== null && value !== undefined && <small className="telemetry-reading-state">Last reading · Offline</small>}
    </Card.Body>
  </Card>
);

export default TelemetryMetricCard;
