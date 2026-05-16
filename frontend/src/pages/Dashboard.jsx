import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads?limit=1000'); // Get many to calculate stats
        const leads = response.data.leads;
        
        const counts = leads.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          acc.total = (acc.total || 0) + 1;
          return acc;
        }, { total: 0, new: 0, contacted: 0, converted: 0 });

        const rate = counts.total > 0 ? ((counts.converted / counts.total) * 100).toFixed(1) : 0;

        setStats({ ...counts, conversionRate: rate });
        
        setChartData([
          { name: 'New', value: counts.new, color: '#3b82f6' },
          { name: 'Contacted', value: counts.contacted, color: '#f59e0b' },
          { name: 'Converted', value: counts.converted, color: '#10b981' }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, bgColor, suffix = "" }) => (
    <div className="card p-6 flex-1 min-w-[200px] flex items-center gap-5" style={{ borderLeft: `4px solid ${color}` }}>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-text-subtle text-sm font-medium">{title}</p>
        <p className="text-[28px] font-bold mt-1 text-text-main">{value}{suffix}</p>
      </div>
    </div>
  );

  if (loading) return <div className="text-text-main">Loading dashboard...</div>;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-text-main">Dashboard Overview</h1>
        <p className="text-text-subtle mt-1">Real-time summary of your lead pipeline</p>
      </div>

      <div className="flex gap-6 flex-wrap mb-10">
        <StatCard title="Total Leads" value={stats.total} icon="📊" color="#6366f1" bgColor="#eef2ff" />
        <StatCard title="New Leads" value={stats.new} icon="✨" color="#3b82f6" bgColor="#eff6ff" />
        <StatCard title="Converted" value={stats.converted} icon="✅" color="#10b981" bgColor="#ecfdf5" />
        <StatCard title="Conversion Rate" value={stats.conversionRate} suffix="%" icon="📈" color="#8b5cf6" bgColor="#f5f3ff" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
        <div className="card p-6">
          <h3 className="mb-6 font-semibold text-text-main">Leads by Status</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-base)' 
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-6 font-semibold text-text-main">Pipeline Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-base)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
