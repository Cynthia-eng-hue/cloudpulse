import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupWebSocket } from './services/websocketService.js';
import monitorRoutes from './routes/monitorRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import logsRoutes from './routes/logsRoutes.js';
dotenv.config();
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(express.json());
// API Routes
app.use('/api/monitor', monitorRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/logs', logsRoutes);
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Setup WebSocket
setupWebSocket(wss);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`BFF Server running on http://localhost:${PORT}`);
});
