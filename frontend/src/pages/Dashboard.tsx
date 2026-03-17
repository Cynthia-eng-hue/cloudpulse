import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Badge,
  Tooltip,
  Button,
  message
} from 'antd';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricChart from '../components/MetricChart';

const { Content } = Layout;

interface MetricData {
  cpu: number;
  memory: number;
  io: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<MetricData[]>([]);
  const [diskHeatmap] = useState(() => 
    Array.from({ length: 25 }, () => Math.floor(Math.random() * 100))
  );

  const [stats, setStats] = useState({
    hosts: 124,
    newHosts: 3,
    s1: 2,
    s2: 12,
    total: 24,
    uptime: 0
  });

  // Calculate uptime since 2026-02-01
  useEffect(() => {
    const startDate = new Date('2026-02-01T00:00:00');
    const updateUptime = () => {
      const now = new Date();
      const diffWeeks = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
      setStats(prev => ({ ...prev, uptime: Number(diffWeeks.toFixed(2)) }));
    };
    updateUptime();
    const interval = setInterval(updateUptime, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initial stats simulation
    setStats(prev => ({
      ...prev,
      hosts: Math.floor(Math.random() * 51) + 100,
      newHosts: Math.floor(Math.random() * 5) + 1,
      s1: Math.floor(Math.random() * 5) + 1,
      s2: Math.floor(Math.random() * 11) + 5,
      total: Math.floor(Math.random() * 21) + 10
    }));

    // Data simulation loop
    const interval = setInterval(() => {
      const newMetric: MetricData = {
        cpu: Math.floor(Math.random() * 41) + 10, // 10-50%
        memory: Math.floor(Math.random() * 31) + 50, // 50-80%
        io: Math.floor(Math.random() * 21) + 5, // 5-25%
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };
      
      setHistory(prev => {
        const updated = [...prev, newMetric];
        return updated.slice(-30); // Keep last 30 points
      });
    }, 1000); // 1s refresh

    return () => clearInterval(interval);
  }, []);

  const getHeatmapColor = (value: number) => {
    if (value < 50) return 'bg-success';
    if (value < 80) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <Content className="p-6 bg-bg-main min-h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Monitor className="text-info w-6 h-6" />
            全景监控大屏
          </h1>
          <p className="text-text-secondary text-sm mt-1">实时观测系统各维度核心指标与告警状态</p>
        </div>
        <div className="flex items-center gap-4 bg-bg-panel p-1 rounded-lg border border-border">
          <button 
            className="px-4 py-1.5 text-xs font-medium bg-info text-white rounded-md shadow-sm"
            onClick={() => message.info('当前已是实时数据')}
          >
            实时
          </button>
          <button 
            className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => message.info('切换至 1小时 视图')}
          >
            1小时
          </button>
          <button 
            className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => message.info('切换至 6小时 视图')}
          >
            6小时
          </button>
        </div>
      </div>

      <Row gutter={[20, 20]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-bg-panel border-border hover:border-info transition-colors group">
            <Statistic 
              title={<span className="text-text-secondary text-xs font-medium uppercase tracking-wider">在线主机数</span>}
              value={stats.hosts}
              prefix={<Activity className="w-4 h-4 text-info mr-2" />}
              valueStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>较上一小时 +{stats.newHosts}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-bg-panel border-border hover:border-info transition-colors">
            <Statistic 
              title={<span className="text-text-secondary text-xs font-medium uppercase tracking-wider">系统运行时长</span>}
              value={stats.uptime}
              suffix="周"
              prefix={<Clock className="w-4 h-4 text-success mr-2" />}
              valueStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-text-secondary">
              自 2026-02-01 起稳定
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-bg-panel border-border hover:border-info transition-colors">
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">告警（S1/S2）</div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold text-danger leading-none">{stats.s1}</div>
                  <div className="text-[10px] text-text-secondary mt-1 uppercase">严重</div>
                </div>
                <div className="w-[1px] h-6 bg-border" />
                <div>
                  <div className="text-2xl font-bold text-warning leading-none">{stats.s2}</div>
                  <div className="text-[10px] text-text-secondary mt-1 uppercase">警告</div>
                </div>
              </div>
              <Activity className="w-8 h-8 text-danger/20" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-bg-panel border-border hover:border-info transition-colors">
            <Statistic 
              title={<span className="text-text-secondary text-xs font-medium uppercase tracking-wider">总告警数</span>}
              value={stats.total}
              prefix={<AlertTriangle className="w-4 h-4 text-warning mr-2" />}
              valueStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-info flex items-center gap-1 cursor-pointer hover:underline">
              <Link to="/alerts" className="flex items-center gap-1">查看告警中心 <ChevronRight className="w-3 h-3" /></Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="mb-8">
        <Col xs={24} lg={16}>
          <Card 
            title={<span className="text-text-primary text-sm font-bold shadow-sm">资源负载趋势</span>} 
            className="bg-bg-panel border-border h-full overflow-hidden"
            extra={<Badge status="processing" text={<span className="text-success text-[10px] font-bold">实时更新 (1s)</span>} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricChart title="CPU 使用率 (%)" data={history.map(h => h.cpu)} timestamps={history.map(h => h.timestamp)} />
              <MetricChart title="内存 使用率 (%)" data={history.map(h => h.memory)} timestamps={history.map(h => h.timestamp)} />
              <MetricChart title="网络 IO (MB/s)" data={history.map(h => h.io)} timestamps={history.map(h => h.timestamp)} />
              <MetricChart title="磁盘 I/O (%)" data={history.map(h => h.io)} timestamps={history.map(h => h.timestamp)} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="text-text-primary text-sm font-bold">磁盘使用率 Top 25（实时热点）</span>} 
            className="bg-bg-panel border-border h-full"
            extra={<Button size="small" type="text" className="text-[10px] text-info" onClick={() => message.success('视图已重置')}>重置视图</Button>}
          >
            <div className="grid grid-cols-5 gap-2">
              {diskHeatmap.map((val, i) => (
                <Tooltip key={i} title={`Host-${i + 1}: ${val}%`}>
                  <div 
                    className={`aspect-square rounded-md ${getHeatmapColor(val)} bg-opacity-80 hover:bg-opacity-100 transition-all cursor-pointer flex items-center justify-center text-[10px] text-white font-bold shadow-inner`}
                  >
                    {val}
                  </div>
                </Tooltip>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2 p-3 bg-bg-main/30 rounded-lg border border-border">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_5px_rgba(34,197,94,0.5)]" /> <span className="text-text-secondary">健康 (&lt;50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> <span className="text-text-secondary">警告 (50-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger shadow-[0_0_5px_rgba(239,68,68,0.5)]" /> <span className="text-text-secondary">严重 (&gt;80%)</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;
