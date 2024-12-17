import { io } from 'socket.io-client';
import type { CrawlMessage } from '../types';

const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL);

export const startCrawl = (url: string): string => {
  const jobId = Math.random().toString(36).substr(2, 9);
  socket.emit('start_crawl', { url, jobId });
  return jobId;
};

export const subscribeToCrawl = (
  jobId: string,
  onMessage: (message: CrawlMessage) => void
) => {
  const handler = (message: CrawlMessage) => {
    onMessage(message);
  };
  
  socket.on(`crawl:${jobId}`, handler);
  return () => {
    socket.off(`crawl:${jobId}`, handler);
  };
};