-- Tables used by reviews and the "problems solved" counter.
-- The app creates these automatically on first use (lib/db.ts); this file is for reference.

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,                      -- optional, never shown publicly
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_hash TEXT NOT NULL,           -- daily-rotating one-way hash, for rate limiting only
  content_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS category TEXT;  -- optional "I am a…" choice, shown publicly
CREATE INDEX IF NOT EXISTS reviews_status_created ON reviews (status, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_ip_created ON reviews (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS site_counters (name TEXT PRIMARY KEY, value BIGINT NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS solve_limits (
  ip_hash TEXT NOT NULL,
  day DATE NOT NULL,
  n INT NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, day)
);

-- Moderation, in the Neon SQL editor:
--   SELECT id, name, rating, message, created_at FROM reviews WHERE status = 'pending' ORDER BY created_at;
--   UPDATE reviews SET status = 'approved' WHERE id = 123;
--   UPDATE reviews SET status = 'rejected' WHERE id = 124;
-- Approved, rejected or deleted reviews update on the site within about a minute.
-- To update at once, open https://www.calculussolver.pro/api/reviews/revalidate?secret=YOUR_SECRET
-- (YOUR_SECRET = the REVALIDATE_SECRET environment variable in Vercel).
