import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Card } from '../../components/common/Card';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setError('');
    try {
      const res = await api.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      setError('Không tải được thống kê');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <Card
        title="Tổng quan"
        extra={
          <button className="button secondary" onClick={loadStats}>
            Refresh
          </button>
        }
      >
        {error && <div className="error-text">{error}</div>}
        {!stats ? (
          <div style={{ fontSize: 14, color: '#9ca3af' }}>Đang tải...</div>
        ) : (
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-label">Số sản phẩm</div>
              <div className="stats-value">{stats.productCount}</div>
            </div>
            <div className="stats-card">
              <div className="stats-label">Tổng tồn kho</div>
              <div className="stats-value">{stats.totalStock}</div>
            </div>
            <div className="stats-card">
              <div className="stats-label">Đơn hàng hoàn tất</div>
              <div className="stats-value">{stats.completedOrders}</div>
            </div>
            <div className="stats-card">
              <div className="stats-label">Doanh thu</div>
              <div className="stats-value">
                {stats.revenue.toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        )}
      </Card>
      
    </>
  );
};

export default DashboardPage;
