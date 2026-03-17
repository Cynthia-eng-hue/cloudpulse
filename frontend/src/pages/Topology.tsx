import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Button, 
  Breadcrumb,
  Modal,
  Tag
} from 'antd';
import { 
  Search, 
  Plus, 
  Server, 
  Database, 
  Globe, 
  ShieldCheck, 
  Cpu,
  Layers,
  Container,
  Activity,
  Box,
  ChevronRight
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  type: '负载均衡' | '微服务' | '数据库' | '缓存' | '基础设施' | '搜索引擎';
  icon: React.ReactNode;
  color: string;
  status: 'healthy' | 'warning' | 'error';
  instances: number;
}

const Topology: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [components, setComponents] = useState<ComponentItem[]>([]);

  // Initial data generation
  useEffect(() => {
    const initialComponents: ComponentItem[] = [
      { id: '1', name: 'Nginx 网关', type: '负载均衡', icon: <Globe className="w-8 h-8" />, color: '#22C55E', status: 'healthy', instances: 4 },
      { id: '2', name: '用户认证服务', type: '微服务', icon: <ShieldCheck className="w-8 h-8" />, color: '#3B82F6', status: 'healthy', instances: 3 },
      { id: '3', name: '用户中心数据库', type: '数据库', icon: <Database className="w-8 h-8" />, color: '#6366F1', status: 'healthy', instances: 1 },
      { id: '4', name: '订单处理引擎', type: '微服务', icon: <Cpu className="w-8 h-8" />, color: '#F59E0B', status: 'warning', instances: 6 },
      { id: '5', name: 'Redis 分布式缓存', type: '缓存', icon: <Activity className="w-8 h-8" />, color: '#EF4444', status: 'healthy', instances: 2 },
      { id: '6', name: '支付处理中心', type: '微服务', icon: <Layers className="w-8 h-8" />, color: '#EC4899', status: 'healthy', instances: 3 },
      { id: '7', name: 'K8s 核心集群', type: '基础设施', icon: <Container className="w-8 h-8" />, color: '#8B5CF6', status: 'healthy', instances: 12 },
      { id: '8', name: 'ES 日志搜索引擎', type: '搜索引擎', icon: <Box className="w-8 h-8" />, color: '#14B8A6', status: 'error', instances: 1 },
      { id: '9', name: 'MySQL 集群', type: '数据库', icon: <Database className="w-8 h-8" />, color: '#3B82F6', status: 'healthy', instances: 2 },
    ];
    setComponents(initialComponents);
  }, []);

  // Simulation loop: 10s status/instance change
  useEffect(() => {
    const interval = setInterval(() => {
      setComponents(prev => {
        const index = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        const comp = { ...next[index] };
        
        // Randomly change status or instances
        if (Math.random() > 0.5) {
          const statuses: ('healthy' | 'warning' | 'error')[] = ['healthy', 'warning', 'error'];
          comp.status = statuses[Math.floor(Math.random() * 3)];
        } else {
          // Adjust instances based on type rules
          if (comp.type === '负载均衡') comp.instances = Math.floor(Math.random() * 3) + 4; // 4-6
          else if (comp.type === '微服务') comp.instances = Math.floor(Math.random() * 4) + 3; // 3-6
          else if (comp.type === '数据库' || comp.type === '缓存') comp.instances = Math.random() > 0.5 ? 1 : 2; // 1-2
          else if (comp.type === '基础设施') comp.instances = Math.floor(Math.random() * 3) + 10; // 10-12
        }
        
        next[index] = comp;
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const showDetail = (comp: ComponentItem) => {
    Modal.info({
      title: `${comp.name} 详情报告`,
      width: 500,
      content: (
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">当前状态</span>
            <Tag color={comp.status === 'healthy' ? 'success' : comp.status === 'warning' ? 'warning' : 'error'}>
              {comp.status.toUpperCase()}
            </Tag>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">实例运行数</span>
            <span className="text-text-primary font-bold">{comp.instances} 个节点</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">响应时间 (P99)</span>
            <span className="text-text-primary">{(Math.random() * 200 + 50).toFixed(0)} ms</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">最近更新</span>
            <span className="text-text-primary">{new Date().toLocaleString()}</span>
          </div>
          <div className="p-3 bg-bg-panel/50 rounded-lg text-xs text-text-secondary border border-border mt-4 italic">
            "该组件目前正在由 K8s 调度中心自动管理，健康状况检测周期为 5s。所有相关指标已同步至 Prometheus。"
          </div>
        </div>
      ),
      okText: '确认',
      className: 'dark-modal'
    });
  };

  const filteredComponents = components.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-bg-main min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Breadcrumb className="mb-2 text-xs">
            <Breadcrumb.Item>基础设施</Breadcrumb.Item>
            <Breadcrumb.Item>服务组件</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
             <Layers className="text-info w-6 h-6" />
             服务拓扑图
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Input 
            prefix={<Search className="w-4 h-4 text-text-secondary" />} 
            placeholder="筛选组件..." 
            className="w-72 h-10 border-border bg-bg-panel hover:border-info focus:border-info text-text-primary shadow-sm"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<Plus className="w-4 h-4 mr-2" />} 
            className="h-10 bg-info hover:bg-info/90 border-none flex items-center shadow-lg shadow-info/20"
          >
            创建组件
          </Button>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        {filteredComponents.map(comp => (
          <Col xs={24} sm={12} lg={8} xl={6} key={comp.id}>
            <Card 
              className="group border border-border hover:border-info hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden p-0 bg-bg-panel/40"
              bodyStyle={{ padding: 0 }}
              onClick={() => showDetail(comp)}
            >
              <div className="p-5 flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl transition-transform group-hover:scale-110 shadow-inner"
                  style={{ backgroundColor: `${comp.color}15`, color: comp.color }}
                >
                  {comp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{comp.type}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      comp.status === 'healthy' ? 'bg-success' : 
                      comp.status === 'warning' ? 'bg-warning' : 'bg-danger'
                    } shadow-[0_0_8px] shadow-current animate-pulse`} />
                  </div>
                  <h3 className="text-text-primary font-bold text-base mt-1 truncate group-hover:text-info transition-colors">
                    {comp.name}
                  </h3>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-bg-panel/50 border-t border-border flex items-center justify-between text-xs transition-colors group-hover:bg-bg-panel/80">
                <div className="flex items-center gap-2 font-medium">
                  <Server className="w-3 h-3 text-text-secondary" />
                  <span className="text-text-secondary">{comp.instances} 个实例</span>
                </div>
                <div className="flex items-center gap-1 text-info font-bold group-hover:gap-2 transition-all">
                  查看详情 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {filteredComponents.length === 0 && (
        <div className="h-[400px] flex items-center justify-center">
          <Card className="max-w-md w-full text-center bg-bg-panel border-border shadow-2xl">
             <Layers className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
             <h2 className="text-text-primary text-lg font-semibold">未找到匹配组件</h2>
             <p className="text-text-secondary text-sm mt-2">请尝试调整搜索关键词或创建新组件。</p>
             <Button type="primary" className="mt-6 bg-info border-none" onClick={() => setSearchTerm('')}>清除搜索</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Topology;
