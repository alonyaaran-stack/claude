const express = require('express');
const cors = require('cors');
const { config, validateConfig } = require('./config');
const creativesRouter = require('./routes/creatives');
const summaryRouter = require('./routes/summary');
const { errorHandler } = require('./middleware/errorHandler');

validateConfig();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/creatives', creativesRouter);
app.use('/api/summary', summaryRouter);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
