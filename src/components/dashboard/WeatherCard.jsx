import React from 'react';
import { Card } from 'react-bootstrap';
import { CloudSun } from 'lucide-react';

const WeatherCard = ({ recommendation, isOnline }) => {
  const confidence = recommendation?.confidenceScore;
  const confidenceLabel = confidence == null ? null : `${Math.round(confidence <= 1 ? confidence * 100 : confidence)}%`;
  const weatherFields = [
    ['Cloud cover', recommendation?.cloudCoverPct, '%'],
    ['Wind', recommendation?.windSpeedKmh, ' km/h'],
    ['Solar elevation', recommendation?.solarElevationDeg, '°'],
  ].filter(([, value]) => value != null);

  return (
    <Card className="weather-summary-card h-100">
      <Card.Body>
        <div className="weather-summary-heading">
          <span className="weather-summary-icon"><CloudSun size={19} /></span>
          <div><span className="weather-summary-kicker">Weather & recommendation</span><strong>{recommendation?.weatherSummary || 'No weather summary reported'}</strong></div>
        </div>
        {weatherFields.length > 0 && <div className="weather-data-grid">
          {weatherFields.map(([label, value, unit]) => <div key={label}><span>{label}</span><strong>{value}{unit}</strong></div>)}
        </div>}
        {recommendation ? <div className="weather-summary-meta">
          {recommendation.recommendedMode && <span className="weather-chip">Recommended · {recommendation.recommendedMode}</span>}
          {confidenceLabel && <span className="weather-chip confidence-chip">{confidenceLabel} confidence</span>}
        </div> : <p className="weather-summary-empty">No recommendation has been returned for this device.</p>}
        {!isOnline && recommendation && <small className="weather-summary-stale">Showing the last saved recommendation</small>}
      </Card.Body>
    </Card>
  );
};

export default WeatherCard;
