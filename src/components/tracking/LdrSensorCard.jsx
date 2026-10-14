import React from 'react';
import { Card } from 'react-bootstrap';
import { Sun } from 'lucide-react';

const LdrSensorCard = ({ latestTelemetry, isOnline }) => {
  const sensors = [
    ['Top left', latestTelemetry?.ldrTopLeft],
    ['Top right', latestTelemetry?.ldrTopRight],
    ['Bottom left', latestTelemetry?.ldrBottomLeft],
    ['Bottom right', latestTelemetry?.ldrBottomRight],
  ];

  return (
    <Card className="ldr-sensor-card h-100">
      <Card.Body className="ldr-sensor-body">
        <div className="ldr-sensor-heading">
          <span className="ldr-sensor-icon"><Sun size={17} strokeWidth={1.9} /></span>
          <span>LDR Sensors</span>
        </div>
        {latestTelemetry ? (
          <div className="ldr-sensor-grid">
            {sensors.map(([label, value]) => (
              <div key={label} className="ldr-sensor-reading">
                <span>{label}</span>
                <strong>{value ?? '—'}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="telemetry-not-reported ldr-sensor-empty">Not reported</p>
        )}
        {!isOnline && latestTelemetry && <p className="ldr-sensor-state">Last reading · Offline</p>}
      </Card.Body>
    </Card>
  );
};

export default LdrSensorCard;
