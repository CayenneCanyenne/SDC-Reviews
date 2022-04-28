const db = require('../database/index');

module.exports = {
  reviews: {
    getReviews: (productId, page, count, sort, callback) => {
      const offset = count * page;
      let sortBy = '';

      if (sort === 'relevant') (sortBy = 'helpfulness DESC, date DESC');
      else if (sort === 'newest') (sortBy = 'date DESC');
      else if (sort === 'helpful') (sortBy = 'helpfulness DESC');

      const query = `SELECT reviews.id AS review_id,
      reviews.rating,
      reviews.summary,
      reviews.recommend,
      reviews.response,
      reviews.body,
      to_timestamp(reviews.date/1000) AS date,
      reviews.reviewer_name,
      reviews.helpfulness,
      jsonb_agg(jsonb_build_object(
        'id', reviews_photos.id,
        'url', reviews_photos.url)
        ) AS photos
      FROM reviews
      LEFT OUTER JOIN reviews_photos ON reviews.id = reviews_photos.review_id
      WHERE product_id=$1 AND reviews.reported <> true
      GROUP BY reviews.id
      ORDER BY $2
      LIMIT $3
      OFFSET $4`;

      return db.query(query, [productId, sortBy, count, offset], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          callback(null, results);
        }
      });
    },

    addReviews: (data, callback) => {
      const {
        rating, summary, body, recommend, name, email, photos, characteristics,
      } = data;
      const productId = data.product_id;
      const characteristicId = Object.keys(characteristics);
      const characteristicValue = Object.values(characteristics);

      const query = `
      WITH review AS (
        INSERT INTO reviews
        (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness)
        VALUES
        (${productId}, ${rating}, extract(epoch from now()) * 1000, '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', 0)
        RETURNING id
      ),
      photos AS(
        INSERT INTO
        reviews_photos(url, review_id)
        VALUES
        (UNNEST ($1::text[]),(SELECT id FROM review))
      )
      INSERT INTO characteristic_reviews
      (characteristic_id, review_id, value)
      VALUES
      (UNNEST ($2::int[]),(SELECT id FROM review), UNNEST ($3::int[]))
      `;

      return db.query(query, [photos, characteristicId, characteristicValue], (err, results) => {
        callback(err, results);
      });
    },
  },

  getReviewsMetadata: (productId, callback) => {
    const query = `SELECT reviews.id AS review_id,
      reviews.rating,
      reviews.recommend,
      jsonb_agg(jsonb_build_object(
        'id', characteristic_reviews.id,
        'name', characteristics.name,
        'value', characteristic_reviews.value
      )) AS characteristics
      FROM reviews
      LEFT OUTER JOIN characteristic_reviews ON reviews.id = characteristic_reviews.review_id
      LEFT OUTER JOIN characteristics ON characteristics.id = characteristic_reviews.characteristic_id
      WHERE reviews.product_id = $1
      GROUP BY reviews.id`;

    return db.query(query, [productId], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, results);
      }
    });
  },

  markHelpful: (id, callback) => {
    const query = `
    UPDATE reviews SET helpfulness = helpfulness + 1 WHERE reviews.id = $1`;
    return db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, results);
      }
    });
  },

  markReported: (id, callback) => {
    const query = `
    UPDATE reviews SET reported=true WHERE reviews.id = $1`;
    return db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, results);
      }
    });
  },
};

// const query = `SELECT json_build_object(
//   'product_id', ${productId},
//   'ratings', json_build_object (
//     '1', (SELECT COUNT(rating) FROM reviews WHERE rating=1 AND product_id=${productId}),
//     '2', (SELECT COUNT(rating) FROM reviews WHERE rating=2 AND product_id=${productId}),
//     '3', (SELECT COUNT(rating) FROM reviews WHERE rating=3 AND product_id=${productId}),
//     '4', (SELECT COUNT(rating) FROM reviews WHERE rating=4 AND product_id=${productId}),
//     '5', (SELECT COUNT(rating) FROM reviews WHERE rating=5 AND product_id=${productId})
//   ),
//   'recommended', json_build_object(
//     'false', (SELECT COUNT(recommend) FROM reviews WHERE recommend='false'
//      AND product_id=${productId}),
//     'true', (SELECT COUNT(recommend) FROM reviews WHERE recommend='true'
//      AND product_id=${productId})
//   ),
//   'characteristics', (SELECT json_object_agg(
//     characteristics.name, (SELECT json_build_object(
//      'id', characteristics.id,
//      'value', (SELECT AVG(value) FROM characteristic_reviews
//       WHERE characteristic_id=characteristics.id)
//      ))
//      ) FROM characteristics WHERE product_id=${productId})) AS metadata
//   FROM reviews WHERE product_id=${productId}`;
