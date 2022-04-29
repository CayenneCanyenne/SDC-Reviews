const NodeCache = require('node-cache');
const models = require('./models');

const reviewsCache = new NodeCache();
const reviewsMetaCache = new NodeCache();

module.exports = {
  reviews: {
    get: (req, res) => {
      const productId = req.query.product_id;
      const page = Number(req.query.page) || 0;
      const count = Number(req.query.count) || 5;
      const sort = req.query.sort || 'relevant';

      if (reviewsCache.has(productId)) {
        res.status(200).send(reviewsCache.get(productId));
      } else {
        models.reviews.getReviews(productId, page, count, sort, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            const data = {
              product: productId, page, count, results: results.rows,
            };
            reviewsCache.set(productId, data);
            res.send(data);
          }
        });
      }
    },
    post: (req, res) => {
      models.reviews.addReviews(req.body, (err, results) => {
        if (err) {
          console.log(err);
          res.sendStatus(404);
        } else {
          console.log('successfully sumbmitted!', results);
          res.sendStatus(201);
        }
      });
    },
  },

  getReviewsMetadata: (req, res) => {
    const productId = req.query.product_id;
    const ratings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    const recommended = {
      false: 0,
      true: 0,
    };

    const characteristics = {};

    if (reviewsMetaCache.has(productId)) {
      res.status(200).send(reviewsMetaCache.get(productId));
    } else {
      models.getReviewsMetadata(productId, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          const charVal = {};
          const charCount = {};
          results.rows.forEach((data) => {
            ratings[data.rating] += 1;
            recommended[data.recommend] += 1;
            data.characteristics.forEach((char) => {
              charVal[char.name] = charVal[char.name] + char.value || char.value;
              charCount[char.name] = charCount[char.name] + 1 || 1;
              characteristics[char.name] = { id: char.id, value: 0 };
            });
            Object.keys(characteristics).forEach((key) => {
              characteristics[key].value = charVal[key] / charCount[key];
            });
          });
          const data = { ratings, recommended, characteristics };
          reviewsMetaCache.set(productId, data);
          res.send(data);
        }
      });
    }
  },

  markHelpful: (req, res) => {
    const id = req.params.review_id;
    models.markHelpful(id, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ results: results.rows, message: 'This review is marked helpful!' });
      }
    });
  },

  markReported: (req, res) => {
    const id = req.params.review_id;
    models.markReported(id, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ results: results.rows, message: 'This review is marked reported!' });
      }
    });
  },
};

// res.send(results.rows[0].metadata);

// const {
//   product_id, rating, summary, recommend, body, name, email,
//   helpfulness, photos,
// } = req.body;
// const characteristicId = Object.keys(req.body.characteristics);
// const value = Object.values(req.body.characteristics);
