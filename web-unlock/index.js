require('dotenv').config();
const express = require('express');
const scraperRoutes = require('./routes/scraper');

const app = express();

app.use(express.json());

app.use('/api', scraperRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Express scraper API is running!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Scraper endpoint available at: http://localhost:${PORT}/api/scrape`);
});

module.exports = app;
