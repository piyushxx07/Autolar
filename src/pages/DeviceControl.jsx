import React, { useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import SectionHeader from '../components/common/SectionHeader';
import { useDevice } from '../context/DeviceContext';
import useRecommendation from '../hooks/useRecommendation';
import deviceApi from '../api/deviceApi';

const DeviceControl = () => {
  const { deviceId } = useDevice();
  const { data: recommendation, loading, error } = useRecommendation(deviceId);
  const [mode, setMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const currentMode = mode || recommendation?.currentMode || null;

  const setDeviceMode = async (nextMode) => {
    setSaving(true);
    setSaveError('');
    try {
      const response = await deviceApi.setMode(deviceId, nextMode);
      setMode(response.data.mode);
    } catch {
      setSaveError('Could not update the device mode. Check the connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="feature-page device-control-page">
      <SectionHeader title="Device Control" subtitle={`Send a tracking mode command to ${deviceId}`} />
      {saveError && <Alert variant="danger" role="alert">{saveError}</Alert>}
      {error && <Alert variant="warning">Recommendation details are unavailable; mode controls are still available.</Alert>}
      <Row className="mt-4 device-control-grid">
        <Col md={7}>
          <Card className="h-100">
            <Card.Header><h5 className="mb-0">Control Mode</h5></Card.Header>
            <Card.Body>
              <p>Reported mode: <strong>{loading && !mode ? 'Loading…' : currentMode || 'Not reported by API'}</strong></p>
              <p className="text-muted">Choose whether the tracker follows the sun or stays fixed. The backend confirms the command after it is sent.</p>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant={['TRACK', 'TRACKING'].includes(currentMode) ? 'success' : 'outline-success'} disabled={saving} onClick={() => setDeviceMode('TRACKING')}>
                  {saving ? <Spinner size="sm" className="me-2" /> : null}Set to Tracking
                </Button>
                <Button variant={currentMode === 'STATIC' ? 'primary' : 'outline-primary'} disabled={saving} onClick={() => setDeviceMode('STATIC')}>
                  Set to Static
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mt-3 mt-md-0">
          <Card className="h-100">
            <Card.Header><h5 className="mb-0">AI Recommendation</h5></Card.Header>
            <Card.Body>
              {recommendation ? <>
                <p>Recommended mode: <strong>{recommendation.recommendedMode}</strong></p>
                <p className="mb-0">{recommendation.reason}</p>
              </> : <p className="text-muted mb-0">No recommendation is available for this device.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceControl;
