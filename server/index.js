import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { crawlWebsite } from './crawler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('start_crawl', async ({ url, jobId }) => {
    try {
      await crawlWebsite(url, (message) => {
        io.emit(`crawl:${jobId}`, message);
      });
    } catch (error) {
      io.emit(`crawl:${jobId}`, {
        type: 'error',
        message: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});