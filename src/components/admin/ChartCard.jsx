import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Package } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  data = [],
  type = 'line',
  dataKey = 'value',
  height = 260,
  colors = ['#00f3ff'],
  headerAction,
  footerAction,
  emptyMessage = 'No data available'
}) {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const val = item.value;
      if (type === 'horizontalBar') {
        return (
          <div
            className="px-2.5 py-1.5 rounded-2 shadow-sm fw-bold"
            style={{
              background: 'var(--bb-surface-2)',
              border: '1px solid var(--bb-border)',
              color: 'var(--bb-text)',
              fontSize: '0.825rem',
              boxShadow: '0 4px 12px var(--bb-shadow)'
            }}
          >
            {val} units sold
          </div>
        );
      }
      if (type === 'bar') {
        return (
          <div
            className="px-2.5 py-1.5 rounded-2 shadow-sm fw-bold"
            style={{
              background: 'var(--bb-surface-2)',
              border: '1px solid var(--bb-border)',
              color: 'var(--bb-text)',
              fontSize: '0.825rem',
              boxShadow: '0 4px 12px var(--bb-shadow)'
            }}
          >
            <div className="text-theme-muted mb-1" style={{ fontSize: '0.72rem' }}>{label}</div>
            <div style={{ color: colors[0] || 'var(--bb-accent)' }}>
              ₹{Number(val).toLocaleString('en-IN')}
            </div>
          </div>
        );
      }
      const fullTitle = item.payload?.fullName || item.payload?.name || label || item.name;
      return (
        <div
          className="p-2.5 rounded-3 shadow-sm"
          style={{
            background: 'var(--bb-surface-2)',
            border: '1px solid var(--bb-border)',
            backdropFilter: 'blur(10px)',
            color: 'var(--bb-text)',
            maxWidth: '280px'
          }}
        >
          <p className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: 'var(--bb-text)' }}>
            {fullTitle}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0 fw-black" style={{ color: entry.color || colors[0], fontSize: '0.875rem' }}>
              {entry.name && entry.name !== 'value' && entry.name !== dataKey ? `${entry.name}: ` : ''}{val}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 py-4 text-center">
          <Package className="text-theme-muted mb-2 opacity-50" size={32} />
          <p className="text-theme-muted fw-medium mb-0" style={{ fontSize: '0.875rem' }}>
            {emptyMessage}
          </p>
        </div>
      );
    }

    switch (type) {
      case 'horizontalBar':
        return (
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bb-border-light)" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--bb-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--bb-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
              tickFormatter={(val) => (val && val.length > 14 ? `${val.substring(0, 14)}…` : val)}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} wrapperStyle={{ outline: 'none' }} />
            <Bar
              dataKey={dataKey}
              fill={colors[0] || 'var(--bb-accent)'}
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bb-border-light)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--bb-border)', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ outline: 'none' }} />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 4, fill: colors[0], strokeWidth: 2, stroke: 'var(--bb-surface-2)' }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bb-border-light)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} wrapperStyle={{ outline: 'none' }} />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: '10px',
                color: 'var(--bb-muted)',
                paddingTop: '12px',
                lineHeight: '18px'
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="var(--bb-surface)" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return null;
    }
  }

  return (
    <div
      className="card border-0 h-100 p-4 d-flex flex-column justify-content-between"
      style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px var(--bb-shadow)' }}
    >
      <div>
        <div className="d-flex align-items-start justify-content-between mb-3 gap-2">
          <div>
            <h5 className="fw-bold text-theme-title mb-1">{title}</h5>
            {subtitle && (
              <p className="text-theme-muted mb-0" style={{ fontSize: '0.8rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
      {footerAction && (
        <div className="pt-3 border-top mt-auto text-end" style={{ borderColor: 'var(--bb-border-light)' }}>
          {footerAction}
        </div>
      )}
    </div>
  )
}
