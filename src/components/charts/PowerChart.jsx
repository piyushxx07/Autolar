import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Spinner } from 'react-bootstrap';
import { Activity } from 'lucide-react';

const PowerChart = ({ historyData, loading, error, title = 'Power generation' }) => {
  // Recharts uses Date objects for the time axis.
  const chartData = (historyData || []).map((item) => ({
    name: new Date(item.recordedAt),
    power: item.calculatedPowerW,
  }));

  return (
    <Card className="chart-card h-100" data-tour="power-history">
      <Card.Header>
        <div className="chart-card-title"><span className="analysis-card-icon"><Activity size={17} /></span><h5 className="card-title">{title}</h5></div>
      </Card.Header>
      <Card.Body className="chart-body">
        {loading ? <div className="text-center"><Spinner animation="border" role="status"><span className="visually-hidden">Loading power history...</span></Spinner></div>
          : error ? <p className="text-danger text-center mb-0">Could not load today’s power history.</p>
            : chartData.length === 0 ? <p className="text-muted text-center mb-0">No power readings recorded today yet.</p>
              : <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 5" vertical={false} />
                  <XAxis dataKey="name" minTickGap={28} tickLine={false} axisLine={false} tickFormatter={(date) =>
                    (chartData.length > 1 && chartData.at(-1).name - chartData[0].name >= 86400000)
                      ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  } />
                  <YAxis tickLine={false} axisLine={false} width={42} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={30} />
                  <Line type="monotone" dataKey="power" name="Power (W)" stroke="#315f40" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>}
      </Card.Body>
    </Card>
  );
};

export default PowerChart;
