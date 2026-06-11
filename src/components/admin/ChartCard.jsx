import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function ChartCard({ title, data, type = 'line', dataKey = 'value', height = 300, colors = ['#00f3ff'] }) {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', backdropFilter: 'blur(10px)' }}>
          <p className="fw-bold text-theme-title mb-1" style={{ fontSize: '0.8rem' }}>{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0 fw-black" style={{ color: entry.color, fontSize: '0.9rem' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 4, fill: colors[0], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--bb-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
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
      className="card border-0 h-100 p-4"
      style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
    >
      <h5 className="fw-bold text-theme-title mb-4">{title}</h5>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
