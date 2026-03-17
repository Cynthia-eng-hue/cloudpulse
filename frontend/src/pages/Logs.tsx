import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Select, 
  Space, 
  Tooltip,
  Input,
  message
} from 'antd';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Pause, 
  Play,
  Search
} from 'lucide-react';

const {  } = Layout;
const { Option } = Select;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation loop: 1s log stream
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      const services = ['认证服务', '订单服务', '支付服务', '网关'];
      const messages = [
        '请求处理成功',
        '接口响应延迟过高',
        '数据库连接超时',
        '用户认证成功',
        '订单创建成功'
      ];

      const levelRoll = Math.random();
      const level = levelRoll < 0.1 ? 'ERROR' : levelRoll < 0.4 ? 'WARN' : 'INFO';

      const newLog: LogEntry = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toISOString(),
        level,
        service: services[Math.floor(Math.random() * services.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.slice(-300); // Buffer 300 entries
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return '#EF4444';
      case 'WARN': return '#F59E0B';
      default: return '#FFFFFF';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  const handleExport = () => {
    const content = logs.map(l => `[${l.timestamp}] [${l.level}] @${l.service}: ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudpulse_logs_${new Date().getTime()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('日志导出成功');
  };

  return (
    <div className="h-full bg-bg-main flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
            <Terminal className="text-info w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">日志实时分析</h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest ont-medium font-bold">Real-time Stream</p>
          </div>
        </div>

        <Space size={16}>
          <Input
            prefix={<Search className="w-4 h-4 text-text-secondary" />}
            placeholder="搜索日志消息或服务..."
            className="w-64 h-9 bg-bg-panel border-border text-text-primary rounded-lg"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Select
            defaultValue="all"
            className="w-32 h-9 custom-select"
            onChange={value => setLogLevel(value)}
          >
            <Option value="all">所有级别</Option>
            <Option value="INFO">INFO</Option>
            <Option value="WARN">WARN</Option>
            <Option value="ERROR">ERROR</Option>
          </Select>
          <div className="h-4 w-[1px] bg-border mx-2" />
          <Tooltip title={isPaused ? "回复实时滚动" : "暂停实时滚动"}>
            <Button
              type="text"
              icon={isPaused ? <Play className="w-4 h-4 text-success" /> : <Pause className="w-4 h-4 text-warning" />}
              onClick={() => setIsPaused(!isPaused)}
              className="hover:bg-bg-panel rounded-lg"
            />
          </Tooltip>
          <Tooltip title="清除控制台">
            <Button
              type="text"
              icon={<Trash2 className="w-4 h-4 text-text-secondary" />}
              onClick={() => setLogs([])}
              className="hover:bg-bg-panel rounded-lg"
            />
          </Tooltip>
          <Button icon={<Download className="w-4 h-4 mr-2" />} className="h-9 flex items-center border-border bg-bg-panel text-text-primary font-bold px-4 rounded-lg" onClick={handleExport}>
             导出
          </Button>
        </Space>
      </div>

      <Card className="flex-1 overflow-hidden bg-black/40 border-border p-0 flex flex-col shadow-inner rounded-xl">
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-bg-panel/50 text-[10px] font-mono text-text-secondary font-bold">
          <span className="w-36 uppercase tracking-widest">时间戳 (TIMESTAMP)</span>
          <span className="w-16 uppercase tracking-widest">级别</span>
          <span className="w-32 uppercase tracking-widest">服务来源</span>
          <span className="flex-1 uppercase tracking-widest">消息内容 (MESSAGE)</span>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-1.5 scroll-smooth custom-scrollbar"
        >
          {filteredLogs.map(log => (
            <div key={log.id} className="flex gap-4 group hover:bg-white/5 py-1 rounded px-2 transition-colors border-l-2 border-transparent hover:border-info">
              <span className="w-36 text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toISOString().split('T')[1].split('.')[0]}</span>
              <span className="w-16 font-bold" style={{ color: getLevelColor(log.level) }}>[{log.level}]</span>
              <span className="w-32 text-info truncate font-medium">@{log.service}</span>
              <span className="flex-1 text-text-primary break-all opacity-90 group-hover:opacity-100">{log.message}</span>
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary gap-4 opacity-50">
               <Terminal className="w-12 h-12" />
               <p className="text-sm font-medium">{isPaused ? "实时流已暂停" : "正在等待日志数据流入..."}</p>
            </div>
          )}
        </div>
        
        <div className="px-5 py-3 border-t border-border bg-bg-panel/30 flex justify-between items-center text-[10px] text-text-secondary font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              已连接：bff-logs-01
            </span>
            <span>已缓冲：<span className="text-text-primary font-bold">{logs.length}</span> 条日志</span>
          </div>
          <div className="flex gap-4">
            <span>系统编码：UTF-8</span>
            <span>格式：JSON</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Logs;
