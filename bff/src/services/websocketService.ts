import { WebSocket, WebSocketServer } from 'ws';
import { generateMetric } from '../utils/dataSimulator.js';

import { checkAlerts, generateTopology } from './alertService.js';
import { generateLog } from '../controllers/logsController.js';


export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected via WebSocket');

    // Send initial topology
    ws.send(JSON.stringify({ 
      type: 'TOPOLOGY_INITIAL', 
      payload: generateTopology(wss) 
    }));


    // Heartbeat mechanism - simple ping/pong logic handled by client
    
    // Simulate real-time monitoring data
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const metric = generateMetric();
        
        // Push metrics
        ws.send(JSON.stringify({
          type: 'METRIC_UPDATE',
          payload: metric,
          timestamp: new Date().toISOString(),
        }));

        // Check alerts
        checkAlerts(metric, wss);

        // Push logs (slightly less frequent: every 2 seconds or 50% chance)
        if (Math.random() > 0.5) {
          ws.send(JSON.stringify({
            type: 'LOG_UPDATE',
            payload: generateLog()
          }));
        }
      }
    }, 1000);



    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });
}
