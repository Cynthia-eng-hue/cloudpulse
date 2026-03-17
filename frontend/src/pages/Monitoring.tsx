import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useWebSocket } from '../hooks/useWebSocket';
import { updateLayout, setHistory } from '../store/slices/metricsSlice';
import DashboardGrid from '../components/DashboardGrid';
import MetricCard from '../components/MetricCard';
import MetricChart from '../components/MetricChart';
import { Alert, Spin } from 'antd';

const Monitoring: React.FC = () => {
  const dispatch = useAppDispatch();
  const { realtime, history, layout } = useAppSelector(state => state.metrics);
  const [range] = useState('1h'); // Removed setRange as it was unused
  const { connected } = useWebSocket('ws://localhost:3001');

  // Load history data when range changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/monitor/history?range=${range}`);
        const result = await response.json();
        dispatch(setHistory(result.data));
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, [range, dispatch]);

  if (!realtime && history.length === 0) {

    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="正在加载监控数据..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">全景监控大屏</h1>
        {!connected && (
          <Alert message="实时连接已断开，正在重连..." type="warning" showIcon />
        )}
      </div>

      <DashboardGrid 
        layout={layout} 
        onLayoutChange={(current) => dispatch(updateLayout(current as any))}
      >
        <div key="cpu-card">
          <MetricCard
            title="CPU 使用率"
            value={realtime?.cpu || 0}
            unit="%"
            data={history.map(m => m.cpu)}
            color="#1890ff"
            status={(realtime?.cpu || 0) > 80 ? 'error' : (realtime?.cpu || 0) > 60 ? 'warning' : 'normal'}
          />
        </div>
        <div key="mem-card">
          <MetricCard
            title="内存 使用率"
            value={realtime?.memory || 0}
            unit="%"
            data={history.map(m => m.memory)}
            color="#52c41a"
            status={(realtime?.memory || 0) > 85 ? 'error' : (realtime?.memory || 0) > 70 ? 'warning' : 'normal'}
          />
        </div>
        <div key="disk-card">
          <MetricCard
            title="磁盘 占用率"
            value={realtime?.disk || 0}
            unit="%"
            data={history.map(m => m.disk)}
            color="#faad14"
            status={(realtime?.disk || 0) > 90 ? 'error' : 'normal'}
          />
        </div>
        <div key="net-card">
          <MetricCard
            title="网络 吞吐量"
            value={realtime?.network || 0}
            unit="MB/s"
            data={history.map(m => m.network)}
            color="#722ed1"
            status="normal"
          />
        </div>
        <div key="cpu-chart">
          <MetricChart
            title="CPU 实时趋势"
            data={history.map(m => m.cpu)}
            timestamps={history.map(m => new Date(m.timestamp).toLocaleTimeString())}
          />
        </div>
        <div key="mem-chart">
          <MetricChart
            title="内存 实时趋势"
            data={history.map(m => m.memory)}
            timestamps={history.map(m => new Date(m.timestamp).toLocaleTimeString())}
          />
        </div>
      </DashboardGrid>
    </div>
  );
};

export default Monitoring;
