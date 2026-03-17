import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Checkbox, 
  Badge,
  Tooltip,
  Empty,
  message
} from 'antd';
import { 
  Filter, 
  Search, 
  Clock, 
  Server, 
  MoreHorizontal, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';
import { List } from 'react-window';

const { Sider, Content } = Layout;
const { Option } = Select;

interface AlertItem {
  id: string;
  ruleName: string;
  host: string;
  level: 'S1' | 'S2' | 'S3';
  status: 'active' | 'confirmed' | 'resolved';
  timestamp: string;
  duration: string;
  value: string | number;
}

const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Initialize with mock data
  useEffect(() => {
    const generateAlerts = (count: number): AlertItem[] => {
      return Array.from({ length: count }, (_, i) => {
        const isMemory = Math.random() > 0.5;
        const levelRoll = Math.random();
        let level: 'S1' | 'S2' | 'S3' = 'S3';
        if (levelRoll < 0.1) level = 'S1';
        else if (levelRoll < 0.3) level = 'S2';

        return {
          id: `alert-${i}`,
          ruleName: isMemory ? "内存可用空间不足" : "CPU 使用率过高",
          host: `node-prod-${Math.floor(Math.random() * 20) + 10}`,
          level,
          status: Math.random() > 0.8 ? 'confirmed' : 'active',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString(),
          duration: `${Math.floor(Math.random() * 10) + 1}m`,
          value: isMemory ? `${(Math.random() * 5 + 90).toFixed(1)}%` : `${(Math.random() * 8 + 80).toFixed(1)}%`
        };
      });
    };

    setAlerts(generateAlerts(100)); // Default 100 for testing scroll
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'S1': return '#EF4444'; // Red
      case 'S2': return '#F59E0B'; // Orange
      case 'S3': return '#3B82F6'; // Blue
      default: return '#9CA3AF';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'S1': return '严重';
      case 'S2': return '警告';
      case 'S3': return '提示';
      default: return level;
    }
  };

  const handleAction = (id: string, action: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: action === 'confirm' ? 'confirmed' : a.status } : a));
    message.success(action === 'confirm' ? '告警已确认' : '告警已屏蔽');
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(a.level);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch = a.ruleName.includes(searchTerm) || a.host.includes(searchTerm);
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const AlertRow = (props: any) => {
    const { index, style } = props;
    const alert = filteredAlerts[index];
    if (!alert) return null;

    return (
      <div 
        style={style} 
        className="px-4 py-2 border-b border-border hover:bg-bg-card transition-colors flex items-center group cursor-default"
      >
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div 
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[0_0_8px] shadow-current" 
            style={{ backgroundColor: getLevelColor(alert.level), color: getLevelColor(alert.level) }} 
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-bold truncate text-sm">{alert.ruleName}</span>
              <Tag color={alert.level === 'S1' ? 'error' : alert.level === 'S2' ? 'warning' : 'processing'} className="text-[10px] py-0 px-1.5 border-none font-bold">
                {getLevelLabel(alert.level)}
              </Tag>
              {alert.status === 'confirmed' && <Tag color="default" className="text-[10px] border-none bg-bg-panel text-text-secondary">已确认</Tag>}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-secondary">
              <span className="flex items-center gap-1 bg-bg-panel px-1.5 py-0.5 rounded"><Server className="w-3 h-3" /> {alert.host}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 px-4 text-xs">
          <div className="text-center w-20">
            <div className="text-text-secondary mb-1">持续时长</div>
            <div className="text-text-primary font-bold">{alert.duration}</div>
          </div>
          <div className="text-center w-20">
            <div className="text-text-secondary mb-1">当前值</div>
            <div className="text-danger font-bold text-sm">{alert.value}</div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="确认告警">
              <Button size="small" type="text" onClick={() => handleAction(alert.id, 'confirm')} icon={<CheckCircle2 className="w-4 h-4 text-success hover:scale-110 transition-transform" />} />
            </Tooltip>
            <Tooltip title="屏蔽告警">
              <Button size="small" type="text" onClick={() => handleAction(alert.id, 'mute')} icon={<ShieldAlert className="w-4 h-4 text-info hover:scale-110 transition-transform" />} />
            </Tooltip>
            <Button size="small" type="text" icon={<MoreHorizontal className="w-4 h-4 text-text-secondary" />} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout className="h-full bg-bg-main overflow-hidden">
      <Sider width={260} className="bg-bg-panel border-r border-border h-full overflow-auto p-5">
        <div className="flex items-center gap-2 mb-8 text-text-primary">
          <Filter className="w-4 h-4 text-info" />
          <span className="font-bold text-base">筛选器</span>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">告警级别</div>
            <Checkbox.Group className="flex flex-col gap-3" onChange={(vals) => setSelectedLevels(vals as string[])}>
              <Checkbox value="S1"><span className="text-sm text-text-primary font-medium">S1 严重</span></Checkbox>
              <Checkbox value="S2"><span className="text-sm text-text-primary font-medium">S2 警告</span></Checkbox>
              <Checkbox value="S3"><span className="text-sm text-text-primary font-medium">S3 提示</span></Checkbox>
            </Checkbox.Group>
          </div>
          
          <div>
            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">状态</div>
            <Select defaultValue="all" className="w-full bg-bg-card border-border" onChange={setStatusFilter}>
              <Option value="all">所有状态</Option>
              <Option value="active">活跃中</Option>
              <Option value="confirmed">已确认</Option>
            </Select>
          </div>
          
          <div>
            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">数据源</div>
            <Select defaultValue="prometheus" className="w-full bg-bg-card border-border">
              <Option value="prometheus">Prometheus-01</Option>
              <Option value="victoria">Victoria-Metrics</Option>
              <Option value="loki">Loki-Logs</Option>
            </Select>
          </div>
        </div>
      </Sider>
      
      <Content className="flex flex-col min-h-0 bg-bg-main">
        {/* Aggregation Header */}
        <div className="px-6 py-4 bg-bg-panel/50 border-b border-border flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
          <div className="flex gap-6">
            <Badge count={filteredAlerts.filter(a => a.level === 'S1').length} overflowCount={999} color="#EF4444" showZero>
              <Button ghost className="border-border hover:border-danger text-text-primary text-xs h-9 px-4 font-bold rounded-lg transition-all">
                S1 严重
              </Button>
            </Badge>
            <Badge count={filteredAlerts.filter(a => a.level === 'S2').length} overflowCount={999} color="#F59E0B" showZero>
              <Button ghost className="border-border hover:border-warning text-text-primary text-xs h-9 px-4 font-bold rounded-lg transition-all">
                S2 警告
              </Button>
            </Badge>
            <Badge count={filteredAlerts.filter(a => a.level === 'S3').length} overflowCount={999} color="#3B82F6" showZero>
              <Button ghost className="border-border hover:border-info text-text-primary text-xs h-9 px-4 font-bold rounded-lg transition-all">
                S3 提示
              </Button>
            </Badge>
          </div>
          
          <div className="w-72">
            <Input 
              prefix={<Search className="w-4 h-4 text-gray-500" />} 
              placeholder="搜索规则名称或主机节点..." 
              className="h-9 text-xs bg-bg-card border-border text-text-primary rounded-full px-4" 
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Virtualized List */}
        <div className="flex-1 overflow-hidden relative">
          {filteredAlerts.length > 0 ? (
            <List
              rowCount={filteredAlerts.length}
              rowHeight={72}
              rowComponent={AlertRow}
              rowProps={{}}
              style={{ height: '100%', width: '100%' }}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-text-secondary">暂无活跃告警</span>} />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default AlertCenter;
