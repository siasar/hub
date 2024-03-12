DROP TABLE IF EXISTS points CASCADE;

CREATE TABLE points (
  id varchar(26) PRIMARY KEY,
  status text,
  version timestamp,
  country_code varchar(2)
);

CREATE INDEX points_country_code_idx ON points (country_code);

DROP TABLE IF EXISTS communities CASCADE;

CREATE TABLE communities (
  id varchar(26) PRIMARY KEY,
  point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
  name text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  score varchar(1),
  wsp float,
  version timestamp,
  population integer,
  households integer,
  households_without_water integer,
  image_url text,
  country_code varchar(2),
  country text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX communities_score_idx ON communities (score);

CREATE INDEX communities_wsp_idx ON communities (wsp);

CREATE INDEX communities_country_code_idx ON communities (country_code);

CREATE INDEX communities_country_idx ON communities (country);

CREATE INDEX communities_adm1_idx ON communities (adm1);

CREATE INDEX communities_adm2_idx ON communities (adm2);

CREATE INDEX communities_adm3_idx ON communities (adm3);

CREATE INDEX communities_adm4_idx ON communities (adm4);

CREATE INDEX communities_geom_idx ON communities USING GIST (geom);

DROP TABLE IF EXISTS systems CASCADE;

CREATE TABLE systems (
  id varchar(26) PRIMARY KEY,
  point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
  name text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  score varchar(1),
  wsi float,
  version timestamp,
  image_url text,
  country_code varchar(2),
  country text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX systems_score_idx ON systems (score);

CREATE INDEX systems_wsi_idx ON systems (wsi);

CREATE INDEX systems_country_code_idx ON systems (country_code);

CREATE INDEX systems_country_idx ON systems (country);

CREATE INDEX systems_adm1_idx ON systems (adm1);

CREATE INDEX systems_adm2_idx ON systems (adm2);

CREATE INDEX systems_adm3_idx ON systems (adm3);

CREATE INDEX systems_adm4_idx ON systems (adm4);

CREATE INDEX systems_geom_idx ON systems USING GIST (geom);

DROP TABLE IF EXISTS providers CASCADE;

CREATE TABLE providers (
  id varchar(26) PRIMARY KEY,
  point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
  name text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  score varchar(1),
  sep float,
  version timestamp,
  image_url text,
  country_code varchar(2),
  country text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX providers_score_idx ON providers (score);

CREATE INDEX providers_sep_idx ON providers (sep);

CREATE INDEX providers_country_code_idx ON providers (country_code);

CREATE INDEX providers_country_idx ON providers (country);

CREATE INDEX providers_adm1_idx ON providers (adm1);

CREATE INDEX providers_adm2_idx ON providers (adm2);

CREATE INDEX providers_adm3_idx ON providers (adm3);

CREATE INDEX providers_adm4_idx ON providers (adm4);

CREATE INDEX providers_geom_idx ON providers USING GIST (geom);

DROP TABLE IF EXISTS countries CASCADE;

CREATE TABLE countries (
  code varchar(2) PRIMARY KEY,
  name text,
  fullname text,
  geom geometry(MultiPolygon, 4326),
  enabled boolean
);

CREATE INDEX countries_geom_idx ON countries USING GIST (geom);

DROP TABLE IF EXISTS communities_systems_providers CASCADE;

CREATE TABLE communities_systems_providers (
  community_id varchar(26) REFERENCES communities(id) ON DELETE CASCADE,
  system_id varchar(26) REFERENCES systems(id) ON DELETE CASCADE,
  provider_id varchar(26) REFERENCES providers(id) ON DELETE CASCADE,
  served_households integer,
  CONSTRAINT unique_community_system_provider UNIQUE (community_id, system_id, provider_id)
);

CREATE INDEX communities_systems_providers_households_idx ON providers (sep);

DROP TABLE IF EXISTS schools CASCADE;

CREATE TABLE schools (
  id varchar(26) PRIMARY KEY,
  name text,
  code text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  score varchar(1),
  shc float,
  staff_women integer,
  staff_men integer,
  students_female integer,
  students_male integer,
  have_toilets boolean,
  version timestamp,
  image_url text,
  country_code varchar(2),
  country text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX schools_score_idx ON schools (score);

CREATE INDEX schools_shc_idx ON schools (shc);

CREATE INDEX schools_country_code_idx ON schools (country_code);

CREATE INDEX schools_country_idx ON schools (country);

CREATE INDEX schools_adm1_idx ON schools (adm1);

CREATE INDEX schools_adm2_idx ON schools (adm2);

CREATE INDEX schools_adm3_idx ON schools (adm3);

CREATE INDEX schools_adm4_idx ON schools (adm4);

CREATE INDEX schools_geom_idx ON schools USING GIST (geom);

DROP TABLE IF EXISTS communities_schools CASCADE;

CREATE TABLE communities_schools (
  community_id varchar(26) REFERENCES communities(id) ON DELETE CASCADE,
  school_id varchar(26) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT unique_community_school UNIQUE (community_id, school_id)
);

DROP TABLE IF EXISTS health_centers CASCADE;

CREATE TABLE health_centers (
  id varchar(26) PRIMARY KEY,
  name text,
  code text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  score varchar(1),
  hcc float,
  staff_women integer,
  staff_men integer,
  have_toilets boolean,
  version timestamp,
  image_url text,
  country_code varchar(2),
  country text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX health_centers_score_idx ON health_centers (score);

CREATE INDEX health_centers_hcc_idx ON health_centers (hcc);

CREATE INDEX health_centers_country_code_idx ON health_centers (country_code);

CREATE INDEX health_centers_country_idx ON health_centers (country);

CREATE INDEX health_centers_adm1_idx ON health_centers (adm1);

CREATE INDEX health_centers_adm2_idx ON health_centers (adm2);

CREATE INDEX health_centers_adm3_idx ON health_centers (adm3);

CREATE INDEX health_centers_adm4_idx ON health_centers (adm4);

CREATE INDEX health_centers_geom_idx ON health_centers USING GIST (geom);

DROP TABLE IF EXISTS communities_health_centers CASCADE;

CREATE TABLE communities_health_centers (
  community_id varchar(26) REFERENCES communities(id) ON DELETE CASCADE,
  health_center_id varchar(26) REFERENCES health_centers(id) ON DELETE CASCADE,
  CONSTRAINT unique_community_health_center UNIQUE (community_id, health_center_id)
);

CREATE OR REPLACE FUNCTION color(value CHAR) 
RETURNS TEXT AS $$
BEGIN
  RETURN CASE value
    WHEN 'A' THEN '#54BA46'
    WHEN 'B' THEN '#FFFF39'
    WHEN 'C' THEN '#FF9326'
    WHEN 'D' THEN '#C92429'
    ELSE '#AAAAAA'
  END;
END;
$$ LANGUAGE plpgsql;