import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Typography } from 'antd';

const { Text } = Typography;

interface MetricChartProps {
  title: string;
  data: number[];
  timestamps: string[];
  unit?: string;
  threshold?: number;
}

const MetricChart: React.FC<MetricChartProps> = ({ 
  title, 
  data, 
  timestamps, 
  unit = '%', 
  threshold = 80 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        title: {
          text: title,
          textStyle: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'normal',
          },
          top: 10,
          left: 10,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#1E293B',
          borderColor: '#374151',
          textStyle: { color: '#FFFFFF' },
          formatter: (params: any) => {
            const p = params[0];
            return `${p.name}<br/>${p.seriesName}: <b>${p.value}${unit}</b>`;
          }
        },
        grid: {
          top: 60,
          left: 40,
          right: 20,
          bottom: 30,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: timestamps,
          axisLine: { lineStyle: { color: '#374151' } },
          axisLabel: { color: '#9CA3AF', fontSize: 10 },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLine: { show: false },
          axisLabel: { 
            color: '#9CA3AF', 
            fontSize: 10,
            formatter: `{value}${unit}`
          },
          splitLine: { lineStyle: { color: '#374151', type: 'dashed' } },
        },
        series: [
          {
            name: title,
            type: 'line',
            data: data,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: data[data.length - 1] > threshold ? '#EF4444' : '#22C55E',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: data[data.length - 1] > threshold ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                },
                {
                  offset: 1,
                  color: 'transparent',
                },
              ]),
            },
          },
        ],
        animation: false,
      };

      chartInstance.current.setOption(option);
      
      // Force a resize after a short delay to ensure container size is correct
      setTimeout(() => {
        chartInstance.current?.resize();
      }, 100);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, [title, data, timestamps, unit, threshold]);

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-3 bg-bg-card/50 border border-border rounded-lg overflow-hidden h-full min-h-[220px]">
      <div className="mb-2">
        <Text strong className="text-text-primary text-xs uppercase opacity-70 tracking-tight">{title}</Text>
      </div>
      <div ref={chartRef} className="w-full h-[180px]" />
    </div>
  );
};

export default MetricChart;
