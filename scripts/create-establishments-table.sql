-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create establishments table with PostGIS geometry
CREATE TABLE IF NOT EXISTS establishments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  street_address TEXT,
  city TEXT,
  postcode TEXT,
  county TEXT,
  state TEXT,
  country TEXT,
  country_code TEXT,
  formatted TEXT,
  confidence REAL,
  location GEOMETRY(Point, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index for efficient geospatial queries
CREATE INDEX IF NOT EXISTS spatial_index ON establishments USING GIST (location);

-- Create regular indexes for common queries
CREATE INDEX IF NOT EXISTS idx_establishments_name ON establishments(name);
CREATE INDEX IF NOT EXISTS idx_establishments_city ON establishments(city);
CREATE INDEX IF NOT EXISTS idx_establishments_country_code ON establishments(country_code);
