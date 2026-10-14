import React, { useMemo } from 'react';
import { useDevice } from '../context/DeviceContext';
import useLatestTelemetry from '../hooks/useLatestTelemetry';
import useRecommendation from '../hooks/useRecommendation';
import useTelemetryHistory from '../hooks/useTelemetryHistory';
import { Col, Row } from 'react-bootstrap';
import WeatherCard from '../components/dashboard/WeatherCard';
import SolarPanelVisual from '../components/dashboard/SolarPanelVisual';
import LdrSensorCard from '../components/tracking/LdrSensorCard';
import PowerChart from '../components/charts/PowerChart';
import SectionHeader from '../components/common/SectionHeader';
import TelemetryMetricCard from '../components/dashboard/TelemetryMetricCard';
import { Zap, Gauge, Activity } from 'lucide-react';

const Dashboard = () => {
  const { deviceId } = useDevice();
  const { data: latestTelemetry, isOnline } = useLatestTelemetry(deviceId);
  const { data: recommendation } = useRecommendation(deviceId);
  // Keep the history query range stable across dashboard renders. The hooks
  // depend on these values, so recreating Date objects here would refetch on
  // every telemetry poll and repeatedly reset the chart to its loading state.
  const todayKey = new Date().toDateString();
  const historyRange = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { start, end: new Date() };
  }, [deviceId, todayKey]);
  const { data: historyData, loading: historyLoading, error: historyError } = useTelemetryHistory(deviceId, historyRange.start, historyRange.end);

  return (
    <div className="dashboard-content reference-dashboard">
      <SectionHeader title="Dashboard" subtitle={`Live cloud readings for ${deviceId}`} />
      <Row className="mb-4 dashboard-overview-row">
        <Col lg={7}><SolarPanelVisual latestTelemetry={latestTelemetry} isOnline={isOnline} /></Col>
        <Col lg={5}><WeatherCard recommendation={recommendation} isOnline={isOnline} /></Col>
      </Row>

      <Row className="mb-4 dashboard-metrics-row">
        <Col xs={6} sm={6} lg><TelemetryMetricCard title="Calculated power" value={latestTelemetry?.calculatedPowerW?.toFixed?.(2)} unit="W" isOnline={isOnline} icon={Zap} /></Col>
        {latestTelemetry?.netPowerW != null && <Col xs={6} sm={6} lg><TelemetryMetricCard title="Net power" value={Number(latestTelemetry.netPowerW).toFixed(2)} unit="W" isOnline={isOnline} icon={Activity} /></Col>}
        <Col xs={6} sm={6} lg><TelemetryMetricCard title="Panel voltage" value={latestTelemetry?.panelVoltage?.toFixed?.(2)} unit="V" isOnline={isOnline} icon={Gauge} /></Col>
        <Col xs={6} sm={6} lg><TelemetryMetricCard title="Panel current" value={latestTelemetry?.panelCurrentMa != null ? (latestTelemetry.panelCurrentMa / 1000).toFixed(3) : null} unit="A" isOnline={isOnline} icon={Activity} /></Col>
        <Col xs={12} sm={6} lg><LdrSensorCard latestTelemetry={latestTelemetry} isOnline={isOnline} /></Col>
      </Row>

      <Row className="mb-4 dashboard-history-row"><Col><PowerChart historyData={historyData} loading={historyLoading} error={historyError} /></Col></Row>
    </div>
  );
};

export default Dashboard;
