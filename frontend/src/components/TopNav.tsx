import { Layout, Dropdown, Popover, message } from 'antd';
import {
  Search,
  Bell,
  Zap,
  User,
  Settings,
  LogOut,
  BellRing
} from 'lucide-react';

const { Header } = Layout;

const TopNav: React.FC = () => {
  const notificationContent = (
    <div className="w-[300px] p-2">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className="font-bold text-sm">实时告警 (最近3条)</span>
        <span className="text-xs text-info cursor-pointer">清除全部</span>
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3 hover:bg-gray-800 p-2 rounded transition-colors cursor-pointer border-b border-border/50 pb-3 last:border-0 last:pb-0">
            <div className="mt-1"><BellRing size={16} className="text-danger"/></div>
            <div>
              <div className="text-xs font-bold">内存使用率超过 90%</div>
              <div className="text-[10px] text-text-secondary mt-1">Host-prod-0{i} • 2分钟前</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center pt-2 border-t border-border">
        <span className="text-xs text-text-secondary hover:text-info cursor-pointer">查看所有告警记录</span>
      </div>
    </div>
  );
  return (
    <Header className="sticky top-0 z-10 flex items-center justify-between px-6 bg-bg-panel border-b border-border h-16">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 px-3 py-1 bg-bg-card border border-border rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
          <Zap className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm text-text-secondary font-medium">Quick Jump</span>
          <span className="text-xs bg-bg-main px-1.5 py-0.5 rounded border border-border text-gray-500">Ctrl K</span>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-info transition-colors" />
          <input 
            type="text" 
            placeholder="搜索指标、告警、资源..." 
            className="bg-bg-card border border-border rounded-full py-2 pl-10 pr-4 text-sm w-80 focus:outline-none focus:border-info focus:ring-1 focus:ring-info transition-all text-text-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center text-xs bg-bg-card border border-border px-3 py-1.5 rounded-md gap-2 cursor-pointer hover:border-info transition-colors">
          <Zap className="w-3.5 h-3.5 text-warning" />
          <span className="text-text-secondary">快速跳转</span>
          <span className="bg-border px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</span>
        </div>

        <Popover content={notificationContent} trigger="click" placement="bottomRight" overlayClassName="notification-popover">
          <div className="relative cursor-pointer group">
            <Bell className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-panel animate-pulse" />
          </div>
        </Popover>

        <Dropdown menu={{ items: [
          { key: 'profile', label: '个人中心', icon: <User size={14}/> },
          { key: 'settings', label: '偏好设置', icon: <Settings size={14}/> },
          { type: 'divider' },
          { key: 'logout', label: '退出登录', icon: <LogOut size={14}/>, danger: true, onClick: () => message.info('正在退出...') }
        ] }} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-3 pl-6 border-l border-border h-8 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-text-primary leading-tight group-hover:text-info transition-colors">管理员用户</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-tighter">DevOps 团队</div>
            </div>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=CloudPulse" 
              alt="User" 
              className="w-9 h-9 rounded-full border-2 border-border p-0.5 group-hover:border-info transition-colors"
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopNav;
