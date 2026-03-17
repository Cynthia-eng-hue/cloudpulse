import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch } from './useRedux';
import { updateRealtime } from '../store/slices/metricsSlice';
import { addAlert } from '../store/slices/alertsSlice';
import { setTopology } from '../store/slices/topologySlice';
import { addLog } from '../store/slices/logsSlice';
import { notification } from 'antd';



export const useWebSocket = (url: string) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket Connected');
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'METRIC_UPDATE':
            dispatch(updateRealtime(data.payload));
            break;
          case 'ALARM_UPDATE':
            dispatch(addAlert(data.payload));
            notification.error({
              message: `告警已触发: ${data.payload.ruleName}`,
              description: `当前数值: ${data.payload.value.toFixed(2)}`,
              placement: 'topRight'
            });
            break;
          case 'TOPOLOGY_INITIAL':
            dispatch(setTopology(data.payload));
            break;
          case 'LOG_UPDATE':
            dispatch(addLog(data.payload));
            break;
        }


      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket Disconnected, attempting reconnect...');
      setConnected(false);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket Error:', err);
      socketRef.current?.close();
    };
  }, [url, dispatch]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
    };
  }, [connect]);

  return { connected };
};
