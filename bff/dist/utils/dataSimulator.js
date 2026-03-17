export const generateMetric = (timestamp = new Date()) => {
    const time = timestamp.getTime() / 1000;
    // Sine wave based base values to simulate realistic fluctuations
    const baseCpu = 30 + Math.sin(time / 60) * 10;
    const baseMem = 50 + Math.cos(time / 120) * 5;
    const baseDisk = 45;
    const baseNet = 200 + Math.sin(time / 30) * 50;
    // Add random jitter
    const jitter = (range) => (Math.random() - 0.5) * range;
    // Simulate occasional spikes (abnormal data)
    const isSpike = Math.random() > 0.95;
    const spikeMultiplier = isSpike ? 2.5 : 1;
    return {
        cpu: Math.min(100, Math.max(0, (baseCpu + jitter(5)) * spikeMultiplier)),
        memory: Math.min(100, Math.max(0, baseMem + jitter(2))),
        disk: Math.min(100, Math.max(0, baseDisk + jitter(1))),
        network: Math.max(0, (baseNet + jitter(20)) * spikeMultiplier),
        timestamp: timestamp.toISOString(),
    };
};
export const generateHistory = (points = 60, intervalSec = 60) => {
    const history = [];
    const now = new Date();
    for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - i * intervalSec * 1000);
        history.push(generateMetric(time));
    }
    return history;
};
