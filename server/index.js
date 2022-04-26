const express = require('express');
const path = require('path');
const morgan = require('morgan');
const controller = require('./controllers');

require('../database/index');

require('dotenv').config();

const { PORT } = process.env;

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

// routes
app.get('/reviews', controller.reviews.get);
app.get('/reviews/meta', controller.getReviewsMetadata);
app.put('/reviews/:review_id/helpful', controller.markHelpful);
app.put('/reviews/:review_id/report', controller.markReported);
app.post('/reviews', controller.reviews.post);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
