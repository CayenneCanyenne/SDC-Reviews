CREATE TABLE IF NOT EXISTS reviews (
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "date" bigint NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "reported" BOOLEAN NOT NULL,
    "reviewer_name" VARCHAR(255) NOT NULL,
    "reviewer_email" VARCHAR(255) NOT NULL,
    "response" VARCHAR,
    "helpfulness" INTEGER DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS characteristics (
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "name" VARCHAR,
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
    "id" SERIAL PRIMARY KEY,
    "characteristic_id" INTEGER REFERENCES characteristics(id),
    "review_id" INTEGER REFERENCES reviews(id),
    "value" INTEGER
);

CREATE TABLE IF NOT EXISTS photos (
    "id" SERIAL PRIMARY KEY,
    "review_id" INTEGER REFERENCES reviews(id),
    "url" VARCHAR
);


-- INDEXES

-- CREATE INDEX idx_review_id ON reviews(product_id);
-- CREATE INDEX idx_reviews_photos_pkey ON photos(review_id);
-- CREATE INDEX idx_characteristics_pkey ON characteristics(product_id);
-- CREATE INDEX idx_characteristic_reviews_pkey ON characteristics_reviews(review_id);