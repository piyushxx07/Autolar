import React, { useMemo, useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import useTelemetryHistory from '../hooks/useTelemetryHistory';
import { formatNumber, formatDate, formatTimeAgo } from '../utils/formatters';
import { Col, Row, Card, Table, FormControl, Form } from "react-bootstrap";
import PowerChart from '../components/charts/PowerChart';
import SectionHeader from '../components/common/SectionHeader';
import { getTelemetryDateRange } from '../utils/telemetryDateRange';
import { Table2, TrendingUp, Zap } from 'lucide-react';

const EnergyHistory = () => {
  const { deviceId } = useDevice();
  const [range, setRange] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { start, end } = useMemo(
    () => getTelemetryDateRange(range, { selectedMonth, startDate, endDate }),
    [range, selectedMonth, startDate, endDate],
  );
  const { data: historyData, loading, error } = useTelemetryHistory(deviceId, start, end);
  const powerValues = historyData.map((item) => item.calculatedPowerW).filter(Number.isFinite);
  const peakPower = powerValues.length ? Math.max(...powerValues) : null;
  const averagePower = powerValues.length ? powerValues.reduce((sum, value) => sum + value, 0) / powerValues.length : null;

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (e.target.value === 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
    if (e.target.value === 'month') setSelectedMonth('');
  };

  return (
    <div className="feature-page energy-history-page">
      <SectionHeader title="Energy History" subtitle={`Recorded output for ${deviceId}`} />
      <div className="analysis-toolbar">
        <Form.Group controlId="history-range" className="analysis-range-field">
          <Form.Label>Time range</Form.Label>
          <Form.Select value={range} onChange={handleRangeChange}>
          <option value="today">Today</option>
          <option value="week">7 Days</option>
          <option value="days30">Last 30 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="month">Select Month</option>
          <option value="custom">Custom</option>
          </Form.Select>
        </Form.Group>
        {range === 'month' && (
          <Form.Group controlId="history-month" className="analysis-month-field">
            <Form.Label>Select month</Form.Label>
            <Form.Control type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </Form.Group>
        )}
        {range === 'custom' && (
            <div className="analysis-date-range">
              <Form.Group className="analysis-date-field">
                <Form.Label>From</Form.Label>
              <FormControl
                aria-label="Start date"
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
              />
              </Form.Group>
              <Form.Group className="analysis-date-field">
                <Form.Label>To</Form.Label>
              <FormControl
                aria-label="End date"
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
              />
              </Form.Group>
            </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="feature-empty-state">
          <strong>Couldn’t load energy history</strong><p>Check the cloud API connection, then try again.</p>
        </div>
      ) : !historyData || historyData.length === 0 ? (
        <div className="feature-empty-state">
          <strong>{range === 'custom' && (!startDate || !endDate) ? 'Choose a date range' : range === 'month' && !selectedMonth ? 'Select a month' : 'No readings in this time range'}</strong><p>{range === 'custom' && (!startDate || !endDate) ? 'Select both the From and To dates to view energy history.' : startDate && endDate && startDate > endDate ? 'The From date must be on or before the To date.' : 'Choose another range or check whether the tracker has sent telemetry.'}</p>
        </div>
      ) : (
        <>
          <Row className="mb-3 energy-summary">
            <Col xs={6} lg={6}>
              <Card className="energy-summary-card"><Card.Body><span className="energy-summary-icon"><Zap size={19} /></span><div><span className="summary-label">Average power</span><strong className="summary-value">{formatNumber(averagePower)} <small>W</small></strong></div></Card.Body></Card>
            </Col>
            <Col xs={6} lg={6}>
              <Card className="energy-summary-card"><Card.Body><span className="energy-summary-icon"><TrendingUp size={19} /></span><div><span className="summary-label">Peak power</span><strong className="summary-value">{formatNumber(peakPower)} <small>W</small></strong></div></Card.Body></Card>
            </Col>
          </Row>
          <div className="mb-4 energy-trend-section">
            <h5>Energy Trend</h5>
            <PowerChart historyData={historyData} loading={false} error={null} title="Power readings over time" />
          </div>

          <Card className="mb-4 energy-readings-card">
            <Card.Header><div className="energy-readings-title"><span className="analysis-card-icon"><Table2 size={17} /></span><h5>Recent readings</h5></div><span className="energy-reading-count">{historyData.length} readings</span></Card.Header>
            <Card.Body>
            <div className="table-responsive">
            <Table className="table table-sm">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Power (W)</th>
                  <th>Voltage (V)</th>
                  <th>Current (A)</th>
                  <th>Pan / Tilt</th>
                </tr>
              </thead>
              <tbody>
                {[...historyData].reverse().map((item, index) => (
                    <tr key={item.id ?? `${item.recordedAt}-${index}`}>
                      <td>{formatDate(item.recordedAt)} {formatTimeAgo(item.recordedAt)}</td>
                      <td>{formatNumber(item.calculatedPowerW)}</td>
                      <td>{formatNumber(item.panelVoltage)}</td>
                      <td>{item.panelCurrentMa == null ? '—' : formatNumber(item.panelCurrentMa / 1000)}</td>
                      <td>{item.servoPan ?? '—'}° / {item.servoTilt ?? '—'}°</td>
                    </tr>
                ))}
              </tbody>
            </Table>
            </div>
            </Card.Body>
          </Card>

        </>
      )}
    </div>
  );
};

export default EnergyHistory;
