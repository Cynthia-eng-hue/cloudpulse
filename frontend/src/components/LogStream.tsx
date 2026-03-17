import React, { useEffect, useRef } from 'react';
import { List } from 'react-window';
import { Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setFilteredLogs } from '../store/slices/logsSlice';

const LogStream: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allLogs, filteredLogs, filter, keyword } = useAppSelector((state: any) => state.logs);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/logProcessor.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (e) => {
      dispatch(setFilteredLogs(e.data));
    };

    return () => workerRef.current?.terminate();
  }, [dispatch]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ logs: allLogs, filter, keyword });
    }
  }, [allLogs, filter, keyword]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'error';
      case 'warn': return 'warning';
      case 'debug': return 'default';
      default: return 'info';
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const log = filteredLogs[index];
    if (!log) return null;

    return (
      <div style={style} className="flex items-center px-4 border-b border-gray-800 font-mono text-xs hover:bg-gray-800 transition-colors py-1">
        <span className="text-gray-500 mr-4 w-40 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
        <Tag color={getLevelColor(log.level)} className="w-16 text-center uppercase text-[10px] scale-90">{log.level}</Tag>
        <span className="text-cyan-400 mr-4 w-32 shrink-0 truncate">{log.service}</span>
        <span className="text-gray-300 flex-1 truncate">{log.message}</span>
      </div>
    );
  };

  const FixedList = List as any;

  return (
    <div className="bg-[#1e1e1e] rounded shadow-inner overflow-hidden border border-gray-800">
      <FixedList
        height={600}
        itemCount={filteredLogs.length}
        itemSize={30}
        width="100%"
      >
        {Row}
      </FixedList>
    </div>
  );
};


export default LogStream;

