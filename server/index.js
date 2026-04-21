import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import feeds from './feeds.js';

const app = express();
app.use(cors());

app.get('/api/arrivals', async (req, res) => {
  const { stopId, line } = req.query;
  if (!stopId || !line) {
    return res.status(400).json({ error: 'Missing stopId or line' });
  }

  const feedUrl = feeds[line];
  if (!feedUrl) {
    return res.status(400).json({ error: 'Invalid line' });
  }

  try {
    const response = await fetch(feedUrl, {
      headers: {
        'x-api-key': process.env.MTA_API_KEY
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch feed');
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(buffer));

    const arrivals = [];
    const now = Math.floor(Date.now() / 1000);

    for (const entity of feed.entity) {
      if (entity.tripUpdate) {
        for (const stopTimeUpdate of entity.tripUpdate.stopTimeUpdate) {
          if (stopTimeUpdate.stopId === stopId && stopTimeUpdate.arrival) {
            const arrivalTime = stopTimeUpdate.arrival.time;
            const minutes = Math.max(0, Math.floor((arrivalTime - now) / 60));
            arrivals.push(minutes);
          }
        }
      }
    }

    arrivals.sort((a, b) => a - b);
    const next5 = arrivals.slice(0, 5);

    res.json({ arrivals: next5 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch arrivals' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});