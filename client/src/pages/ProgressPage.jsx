import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, LoadingSpinner } from '../components/StatCard';
import { 
  TrendingUp, 
  Coins, 
  Clock, 
  Award, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

const ProgressPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const [statsRes, progressRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/progress')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setTransactions(statsRes.data.transactions || []);
      }

      if (progressRes.data.success) {
        setChartData(progressRes.data.chartData || []);
      }
    } catch (err) {
      console.error('Progress load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing learning progress & credit ledger..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Learning Progress & Credits</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Review your academic exchange metrics, teaching contributions, and credit transaction ledger.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4">
        <StatCard
          title="Current Credit Balance"
          value={`${stats?.credits ?? 10} 🪙`}
          icon={Coins}
          color="warning"
          subtext="Available for learning requests"
        />
        <StatCard
          title="Hours Taught"
          value={`${stats?.hoursTaught || 0} hrs`}
          icon={Clock}
          color="primary"
          subtext="Contributions to peers"
        />
        <StatCard
          title="Hours Learned"
          value={`${stats?.hoursLearned || 0} hrs`}
          icon={TrendingUp}
          color="secondary"
          subtext="Mentorship received"
        />
        <StatCard
          title="Completed Exchanges"
          value={stats?.completedCount ?? 0}
          icon={CheckCircle2}
          color="success"
          subtext="Verified peer sessions"
        />
      </div>

      {/* Learning Analytics Visual Breakdown */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Monthly Activity Comparison (Hours Taught vs Learned)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Visualizing your bidirectional peer teaching contributions.
        </p>

        {/* CSS/SVG Bar Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: '200px',
          padding: '1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          gap: '1.5rem'
        }}>
          {chartData.map((d, idx) => {
            const maxVal = Math.max(1, ...chartData.map(item => Math.max(item.taught || 0, item.learned || 0)));
            const taughtHeight = Math.max(12, ((d.taught || 0) / maxVal) * 140);
            const learnedHeight = Math.max(12, ((d.learned || 0) / maxVal) * 140);

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '100px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.375rem', height: '150px' }}>
                  {/* Taught Bar */}
                  <div
                    title={`Taught: ${d.taught}h`}
                    style={{
                      width: '20px',
                      height: `${taughtHeight}px`,
                      backgroundColor: 'var(--primary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 400ms ease'
                    }}
                  />
                  {/* Learned Bar */}
                  <div
                    title={`Learned: ${d.learned}h`}
                    style={{
                      width: '20px',
                      height: `${learnedHeight}px`,
                      backgroundColor: 'var(--secondary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 400ms ease'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '2px' }} />
            <span>Hours Taught (Mentor)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--secondary)', borderRadius: '2px' }} />
            <span>Hours Learned (Student)</span>
          </div>
        </div>
      </div>

      {/* Credit Transaction Ledger Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Credit Ledger & Transaction Audit
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Immutable ledger of skill credits earned, spent, and awarded.
        </p>

        {transactions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Description</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => {
                  const isPositive = tx.amount > 0;
                  const dateStr = new Date(tx.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                          {tx.type ? tx.type.replace(/_/g, ' ') : 'Transaction'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {tx.description}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: isPositive ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {isPositive ? `+${tx.amount}` : tx.amount} 🪙
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            No credit transactions recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
