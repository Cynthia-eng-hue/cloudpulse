import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Switch, 
  Button, 
  Input, 
  Tree, 
  Tag, 
  Space, 
  Tooltip,
  Dropdown,
  message
} from 'antd';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Copy,
  FolderTree,
  BellRing
} from 'lucide-react';

const { Sider, Content } = Layout;

interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  businessGroup: string;
  modifier: string;
  modifiedTime: string;
}

const treeData = [
  {
    title: '所有业务组',
    key: 'all',
    children: [
      { title: '基础设施', key: '基础设施' },
      { title: '支付系统', key: '支付系统' },
      { title: '用户服务', key: '用户服务' },
    ],
  },
];

const AlertRules: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [rules, setRules] = useState<AlertRule[]>([]);

  useEffect(() => {
    const initialRules: AlertRule[] = [
      { id: '1', name: 'CPU 高使用率监控 (生产)', enabled: true, businessGroup: '基础设施', modifier: 'admin_sys', modifiedTime: '2026-03-15 10:20:00' },
      { id: '2', name: '内存泄漏自动检测', enabled: false, businessGroup: '支付系统', modifier: 'dev_lee', modifiedTime: '2026-03-14 15:45:00' },
      { id: '3', name: '磁盘空间关键告警', enabled: true, businessGroup: '用户服务', modifier: 'ops_wang', modifiedTime: '2026-03-15 09:12:00' },
      { id: '4', name: '服务不可达连接异常', enabled: true, businessGroup: '基础设施', modifier: 'admin_sys', modifiedTime: '2026-03-13 11:30:00' },
      { id: '5', name: 'API 响应延迟过高', enabled: true, businessGroup: '用户服务', modifier: 'dev_lee', modifiedTime: '2026-03-15 14:00:00' },
    ];
    setRules(initialRules);
  }, []);

  const handleToggle = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    message.success('规则状态已更新');
  };

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || r.businessGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="text-text-primary font-bold text-sm">{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: AlertRule) => (
        <Switch 
          checked={enabled} 
          size="small" 
          checkedChildren="ON" 
          unCheckedChildren="OFF" 
          onChange={() => handleToggle(record.id)}
          className={enabled ? 'bg-success' : 'bg-gray-600'}
        />
      ),
    },
    {
      title: '业务组',
      dataIndex: 'businessGroup',
      key: 'businessGroup',
      render: (text: string) => <Tag className="border-border bg-bg-panel/50 text-text-secondary font-medium px-2">{text}</Tag>,
    },
    {
      title: '修改人',
      dataIndex: 'modifier',
      key: 'modifier',
      render: (text: string) => <span className="text-text-secondary text-xs">{text}</span>,
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (text: string) => <span className="text-text-secondary text-xs font-mono">{text}</span>,
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              size="small" 
              type="text" 
              icon={<Edit2 className="w-4 h-4 text-info hover:scale-110 transition-transform" />} 
              onClick={() => message.info('编辑功能开发中...')} 
            />
          </Tooltip>
          <Dropdown menu={{ 
            items: [
              { key: 'clone', label: '克隆规则', icon: <Copy className="w-4 h-4" />, onClick: () => message.info('正在克隆策略...') },
              { key: 'delete', label: '删除', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => message.info('已提交删除申请') },
            ] 
          }}>
            <Button size="small" type="text" icon={<MoreVertical className="w-4 h-4 text-text-secondary" />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="h-full bg-bg-main overflow-hidden">
      <Sider width={280} className="bg-bg-panel border-r border-border h-full overflow-auto p-5">
        <div className="flex items-center gap-2 mb-6 text-text-primary">
          <FolderTree className="w-4 h-4 text-info" />
          <span className="font-bold text-base">业务组筛选</span>
        </div>
        <div className="bg-bg-card/20 rounded-xl p-3 border border-border/50">
          <Tree
            showLine
            defaultExpandAll
            treeData={treeData}
            onSelect={(keys) => setSelectedGroup(keys[0] as string || 'all')}
            className="bg-transparent text-text-secondary text-sm custom-tree"
          />
        </div>
        
        <div className="mt-8 p-4 bg-info/5 rounded-xl border border-info/20">
          <div className="text-xs text-info font-bold uppercase mb-2">管理提示</div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            告警规则默认应用于生产环境所有节点。如需针对特定节点设置，请在编辑页面中使用标签筛选。
          </p>
        </div>
      </Sider>

      <Content className="flex flex-col p-8 min-h-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center">
              <BellRing className="w-6 h-6 text-warning" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-text-primary tracking-tight">告警策略管理</h1>
               <p className="text-text-secondary text-xs mt-1">配置并管理多维度的系统性能及业务可用性告警规则</p>
             </div>
          </div>
          
          <Space size={16}>
            <Input 
              prefix={<Search className="w-4 h-4 text-gray-400" />} 
              placeholder="按规则名称搜索..." 
              className="w-72 h-10 bg-bg-panel border-border text-text-primary rounded-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<Plus className="w-4 h-4 mr-1" />} 
              className="h-10 bg-info hover:bg-info/90 border-none flex items-center px-6 font-bold rounded-lg shadow-lg shadow-info/20"
            >
              创建规则
            </Button>
          </Space>
        </div>

        <div className="flex-1 bg-bg-panel/30 border border-border rounded-2xl overflow-hidden shadow-sm">
          <Table 
            columns={columns} 
            dataSource={filteredRules} 
            rowKey="id"
            pagination={{ 
              pageSize: 8,
              showSizeChanger: false,
              className: "px-6 pb-4"
            }}
            className="custom-table"
            size="large"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AlertRules;
