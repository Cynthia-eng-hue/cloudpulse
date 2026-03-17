import React from 'react';
import { List } from 'react-window';
import { Tag, Typography } from 'antd';
import type { Alert } from '../store/slices/alertsSlice';

const { Text } = Typography;

interface AlertsTableProps {
  alerts: Alert[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const alert = alerts[index];
    if (!alert) return null;
    return (
      <div style={style} className="border-b border-gray-100 flex items-center px-4 hover:bg-gray-50 transition-colors">
        <div className="flex-1 flex items-center gap-4">
          <Tag color="error">CRITICAL</Tag>
          <div className="flex-1">
            <div className="font-bold text-gray-800">{alert.ruleName}</div>
            <Text type="secondary" className="text-xs">
              {new Date(alert.timestamp).toLocaleString()}
            </Text>
          </div>
          <div className="text-right">
            <span className="text-red-500 font-mono font-bold mr-2">{alert.value.toFixed(2)}</span>
            <Text type="secondary">{alert.metric.toUpperCase()}</Text>
          </div>
        </div>
      </div>
    );
  };

  const FixedList = List as any;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-600 flex">
        <span className="flex-1">告警事件</span>
        <span>指标数值</span>
      </div>
      <FixedList
        height={500}
        itemCount={alerts.length}
        itemSize={70}
        width="100%"
      >
        {Row}
      </FixedList>
    </div>
  );
};


export default AlertsTable;

