import { faker } from '@faker-js/faker';
const services = ['auth-service', 'gateway', 'payment-svc', 'inventory-db', 'order-processor'];
const messages = [
    'User login successful',
    'Failed to connect to database',
    'Transaction timeout after 5000ms',
    'API Gateway rate limit exceeded',
    'Cache miss for key: user_profile_123',
    'Starting background worker: cleanup-job',
    'Received invalid payload from upstream',
    'Processing order #CP-98765',
    'Auth token expired for session: XYZ',
    'Health check passed for all nodes'
];
export const generateLog = () => ({
    id: faker.string.uuid(),
    level: faker.helpers.arrayElement(['info', 'info', 'info', 'warn', 'error', 'debug']),
    service: faker.helpers.arrayElement(services),
    message: faker.helpers.arrayElement(messages),
    timestamp: new Date().toISOString()
});
export const searchLogs = (req, res) => {
    const { query, level } = req.query;
    const results = Array.from({ length: 20 }).map(generateLog);
    // Simulated filtering
    res.json(results);
};
