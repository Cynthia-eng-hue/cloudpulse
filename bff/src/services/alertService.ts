import { WebSocket, WebSocketServer } from 'ws';
import { alertRules, AlertRule } from '../controllers/alertsController.js';
import { MetricData } from '../utils/dataSimulator.js';

export function checkAlerts(metric: MetricData, wss: WebSocketServer) {
  alertRules.forEach(rule => {
    if (!rule.enabled) return;

    const value = (metric as any)[rule.metric];
    const isTriggered = rule.condition === '>' ? value > rule.threshold : value < rule.threshold;

    if (isTriggered) {
      const alertPayload = {
        type: 'ALARM_UPDATE',
        payload: {
          id: Date.now().toString(),
          ruleId: rule.id,
          ruleName: rule.name,
          value,
          metric: rule.metric,
          timestamp: new Date().toISOString()
        }
      };

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(alertPayload));
        }
      });
    }
  });
}

export function generateTopology(wss: WebSocketServer) {
  const nodes = [
    { id: 'gateway', label: 'API Gateway', status: 'normal' },
    { id: 'auth-svc', label: 'Auth Service', status: 'normal' },
    { id: 'order-svc', label: 'Order Service', status: 'normal' },
    { id: 'pay-svc', label: 'Payment Service', status: 'warning' },
    { id: 'db-main', label: 'Main Database', status: 'normal' }
  ];
  
  const edges = [
    { source: 'gateway', target: 'auth-svc' },
    { source: 'gateway', target: 'order-svc' },
    { source: 'order-svc', target: 'pay-svc' },
    { source: 'pay-svc', target: 'db-main' }
  ];

  return { nodes, edges };
}
