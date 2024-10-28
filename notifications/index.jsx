const express = require('express');
const Redis = require('ioredis');
const RateLimit = require('express-rate-limit');

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(express.json());

app.post('/notify', limiter, async (req, res) => {
  const { message } = req.body;
  await redis.publish('notifications', JSON.stringify(message));
  res.status(200).json({ status: 'Notification sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Notifications service running on port ${PORT}`));