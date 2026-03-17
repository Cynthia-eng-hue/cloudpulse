import { faker } from '@faker-js/faker';
let alertRules = [
    { id: '1', name: 'High CPU Usage', metric: 'cpu', condition: '>', threshold: 80, enabled: true },
    { id: '2', name: 'Memory Warning', metric: 'memory', condition: '>', threshold: 70, enabled: true },
];
export const getAlertRules = (req, res) => {
    res.json(alertRules);
};
export const createAlertRule = (req, res) => {
    const newRule = {
        id: faker.string.uuid(),
        ...req.body
    };
    alertRules.push(newRule);
    res.status(201).json(newRule);
};
export const updateAlertRule = (req, res) => {
    const { id } = req.params;
    alertRules = alertRules.map(rule => rule.id === id ? { ...rule, ...req.body } : rule);
    res.json({ status: 'success' });
};
export const deleteAlertRule = (req, res) => {
    const { id } = req.params;
    alertRules = alertRules.filter(rule => rule.id !== id);
    res.json({ status: 'success' });
};
export const getAlertHistory = (req, res) => {
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
