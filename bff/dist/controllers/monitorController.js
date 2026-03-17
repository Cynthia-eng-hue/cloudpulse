import { generateMetric, generateHistory } from '../utils/dataSimulator.js';
export const getSystemStatus = (req, res) => {
    // Keeping the original servers status logic but adding more detailed metrics
    const status = {
        metrics: generateMetric(),
        timestamp: new Date().toISOString(),
    };
    res.json(status);
};
export const getMetricsHistory = (req, res) => {
    const { range = '1h' } = req.query;
    let points = 60;
    let interval = 60; // default 1 minute for 1h range
    if (range === '24h') {
        points = 144;
        interval = 600; // 10 minutes
    }
    else if (range === '7d') {
        points = 168;
        interval = 3600; // 1 hour
    }
    const history = generateHistory(points, interval);
    res.json({
        range,
        data: history
    });
};
