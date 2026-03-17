import React, { useMemo } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts';
import EChartBase from './EChartBase';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  data: number[];
  color: string;
  status: 'normal' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, data, color, status }) => {
  const statusColor = useMemo(() => {
    if (status === 'error') return '#ff4d4f';
    if (status === 'warning') return '#faad14';
    return color;
  }, [status, color]);

  const chartOptions = useMemo(() => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [{
      data,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: statusColor, width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: statusColor + '80' },
          { offset: 1, color: statusColor + '00' }
        ])
      }
    }]
  }), [data, statusColor]);


  return (
    <Card className="h-full overflow-hidden" bodyStyle={{ padding: '12px' }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusColor }} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value.toFixed(1)}</span>
        <span className="text-gray-400 text-xs">{unit}</span>
      </div>
      <div className="h-10 mt-2">
        <EChartBase options={chartOptions as any} style={{ height: '100%', width: '100%' }} />
      </div>
    </Card>
  );
};

export default MetricCard;
