import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartBaseProps {
  options: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  onResize?: () => void;
}

const EChartBase: React.FC<EChartBaseProps> = ({ options, style, className, onResize }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });
      chartInstance.current.setOption(options);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(options, { notMerge: false });
    }
  }, [options]);

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
      onResize?.();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onResize]);

  return <div ref={chartRef} style={style} className={className} />;
};

export default EChartBase;
