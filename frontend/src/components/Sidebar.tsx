import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText, 
  Settings,
  ShieldAlert,
  Layers,
  Activity,
  Bell
} from 'lucide-react';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      icon: <Activity className="w-4 h-4" />,
      label: <Link to="/">全景监控大屏</Link>,
    },
    {
      key: '/topology',
      icon: <Layers className="w-4 h-4" />,
      label: <Link to="/topology">服务拓扑图</Link>,
    },
    {
      key: '/alerts',
      icon: <Bell className="w-4 h-4" />,
      label: <Link to="/alerts">告警中心</Link>,
    },
    {
      key: '/alerts/rules',
      icon: <ShieldAlert className="w-4 h-4" />,
      label: <Link to="/alerts/rules">告警策略</Link>,
    },
    {
      key: '/logs',
      icon: <FileText className="w-4 h-4" />,
      label: <Link to="/logs">日志实时分析</Link>,
    },
    {
      key: '/settings',
      icon: <Settings className="w-4 h-4" />,
      label: <Link to="/settings">系统设置</Link>,
    },
  ];

  return (
    <Sider
      width={240}
      theme="dark"
      className="fixed left-0 top-0 h-screen overflow-auto border-r border-border"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="h-16 flex items-center px-6 gap-3 border-b border-border/50">
        <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
          <Activity className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-base leading-tight">云脉监控</span>
          <span className="text-text-secondary text-[10px] uppercase tracking-widest ont-medium">CloudPulse</span>
        </div>
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="px-2"
      />
    </Sider>
  );
};

export default Sidebar;
