import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: '>' | '<';
  threshold: number;
  enabled: boolean;
}

let alertRules: AlertRule[] = [
  { id: '1', name: 'High CPU Usage', metric: 'cpu', condition: '>', threshold: 80, enabled: true },
  { id: '2', name: 'Memory Warning', metric: 'memory', condition: '>', threshold: 70, enabled: true },
];

export const getAlertRules = (req: Request, res: Response) => {
  res.json(alertRules);
};

export const createAlertRule = (req: Request, res: Response) => {
  const newRule: AlertRule = {
    id: faker.string.uuid(),
    ...req.body
  };
  alertRules.push(newRule);
  res.status(201).json(newRule);
};

export const updateAlertRule = (req: Request, res: Response) => {
  const { id } = req.params;
  alertRules = alertRules.map(rule => rule.id === id ? { ...rule, ...req.body } : rule);
  res.json({ status: 'success' });
};

export const deleteAlertRule = (req: Request, res: Response) => {
  const { id } = req.params;
  alertRules = alertRules.filter(rule => rule.id !== id);
  res.json({ status: 'success' });
};

export const getAlertHistory = (req: Request, res: Response) => {
  const history = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    ruleName: faker.helpers.arrayElement(alertRules.map(r => r.name)),
    value: faker.number.int({ min: 70, max: 100 }),
    timestamp: faker.date.recent().toISOString(),
    status: 'active'
  }));
  res.json(history);
};

export { alertRules };
