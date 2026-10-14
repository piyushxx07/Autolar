import React, { useMemo, useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import useTelemetryHistory from '../hooks/useTelemetryHistory';
import { formatNumber } from '../utils/formatters';
import { Col, Row, Card, FormControl, Form } from 'react-bootstrap';
import PowerChart from '../components/charts/PowerChart';
import VoltageChart from '../components/charts/VoltageChart';
import CurrentChart from '../components/charts/CurrentChart';
import SectionHeader from '../components/common/SectionHeader';
import { getTelemetryDateRange } from '../utils/telemetryDateRange';
import { Activity, Gauge, TrendingUp, Zap } from 'lucide-react';

const rangeLabel = (range) => ({ today: 'Today', week: '7 days', days30: 'Last 30 days', lastMonth: 'Last month', month: 'Selected month', custom: 'Custom' }[range] || range);

const Analytics = () => {
  const { deviceId } = useDevice();
  const [range, setRange] = useState('today'); // today, week, days30, lastMonth, month, custom
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { start, end } = useMemo(
    () => getTelemetryDateRange(range, { selectedMonth, startDate, endDate }),
    [range, selectedMonth, startDate, endDate],
  );
  const { data: historyData, loading, error } = useTelemetryHistory(deviceId, start, end);

  // Calculate summary statistics
  const calculateSummary = (data) => {
    if (!data || data.length === 0) {
      return {
        avgPower: null,
        peakPower: null,
        avgVoltage: null,
        avgCurrent: null,
      };
    }

    const powers = data.map((d) => d.calculatedPowerW).filter(Number.isFinite);
    const voltages = data.map((d) => d.panelVoltage).filter(Number.isFinite);
    const currents = data.map((d) => d.panelCurrentMa).filter(Number.isFinite);

    const avgPower = powers.length ? powers.reduce((a, b) => a + b, 0) / powers.length : null;
    const peakPower = powers.length ? Math.max(...powers) : null;
    const avgVoltage = voltages.length ? voltages.reduce((a, b) => a + b, 0) / voltages.length : null;
    const avgCurrent = currents.length ? (currents.reduce((a, b) => a + b, 0) / currents.length) / 1000 : null;

    return {
      avgPower,
      peakPower,
      avgVoltage,
      avgCurrent,
    };
  };

  const summary = calculateSummary(historyData);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (e.target.value === 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
    if (e.target.value === 'month') setSelectedMonth('');
  };

  return (
    <div className="feature-page analytics-page">
      <SectionHeader title="Analytics" subtitle={`Performance trends for ${deviceId}`} />
      <div className="analysis-toolbar">
        <Form.Group controlId="analytics-range" className="analysis-range-field">
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
          <Form.Group controlId="analytics-month" className="analysis-month-field">
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
          <strong>Couldn’t load analytics</strong><p>Check the cloud API connection, then try again.</p>
        </div>
      ) : !historyData || historyData.length === 0 ? (
        <div className="feature-empty-state">
          <strong>{range === 'custom' && (!startDate || !endDate) ? 'Choose a date range' : range === 'month' && !selectedMonth ? 'Select a month' : 'No readings in this time range'}</strong><p>{range === 'custom' && (!startDate || !endDate) ? 'Select both the From and To dates to view analytics.' : startDate && endDate && startDate > endDate ? 'The From date must be on or before the To date.' : 'Choose another range or check whether the tracker has sent telemetry.'}</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row className="mb-4 analytics-summary-row">
            <Col xs={6} sm={6} xl={3}>
              <Card className="text-center analytics-summary-card">
                <Card.Body>
                  <span className="analytics-summary-icon"><Zap size={19} /></span>
                  <div className="analytics-summary-copy"><Card.Title>Average Power</Card.Title><Card.Text className="display-5 analytics-summary-value">{formatNumber(summary.avgPower)} W</Card.Text></div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Card className="text-center analytics-summary-card">
                <Card.Body>
                  <span className="analytics-summary-icon"><TrendingUp size={19} /></span>
                  <div className="analytics-summary-copy"><Card.Title>Peak Power</Card.Title><Card.Text className="display-5 analytics-summary-value">{formatNumber(summary.peakPower)} W</Card.Text></div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Card className="text-center analytics-summary-card">
                <Card.Body>
                  <span className="analytics-summary-icon"><Gauge size={19} /></span>
                  <div className="analytics-summary-copy"><Card.Title>Average Voltage</Card.Title><Card.Text className="display-5 analytics-summary-value">{formatNumber(summary.avgVoltage)} V</Card.Text></div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Card className="text-center analytics-summary-card">
                <Card.Body>
                  <span className="analytics-summary-icon"><Activity size={19} /></span>
                  <div className="analytics-summary-copy"><Card.Title>Average Current</Card.Title><Card.Text className="display-5 analytics-summary-value">{summary.avgCurrent == null ? '—' : `${formatNumber(summary.avgCurrent * 1000)} mA`}</Card.Text></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="mb-4">
            <Col xl={4}>
              <PowerChart historyData={historyData} loading={false} error={null} title={`Power · ${rangeLabel(range)}`} />
            </Col>
            <Col xl={4}>
              <VoltageChart historyData={historyData} loading={false} error={null} title={`Voltage · ${rangeLabel(range)}`} />
            </Col>
            <Col xl={4}>
              <CurrentChart historyData={historyData} loading={false} error={null} title={`Current · ${rangeLabel(range)}`} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Analytics;
