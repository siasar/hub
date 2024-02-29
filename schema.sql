DROP TABLE IF EXISTS points CASCADE;

CREATE TABLE points (
  id varchar(26) PRIMARY KEY,
  status text,
  version timestamp,
  country varchar(2)
);

CREATE INDEX points_country_idx ON points (country);

DROP TABLE IF EXISTS communities CASCADE;

CREATE TABLE communities (
  id varchar(26) PRIMARY KEY,
  point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
  name text,
  latitude float,
  longitude float,
  geom geometry(Point, 4326),
  status text,
  wsp varchar(1),
  wsp_value float,
  version timestamp,
  population integer,
  households integer,
  households_without_water integer,
  image_url text,
  country varchar(2),
  adm0 text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX communities_wsp_idx ON communities (wsp);

CREATE INDEX communities_wsp_value_idx ON communities (wsp_value);

CREATE INDEX communities_country_idx ON communities (country);

CREATE INDEX communities_adm0_idx ON communities (adm0);

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
  wsi varchar(1),
  wsi_value float,
  version timestamp,
  image_url text,
  country varchar(2),
  adm0 text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX systems_wsi_idx ON systems (wsi);

CREATE INDEX systems_wsi_value_idx ON systems (wsi_value);

CREATE INDEX systems_country_idx ON systems (country);

CREATE INDEX systems_adm0_idx ON systems (adm0);

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
  sep varchar(1),
  sep_value float,
  version timestamp,
  image_url text,
  country varchar(2),
  adm0 text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX providers_sep_idx ON providers (sep);

CREATE INDEX providers_sep_value_idx ON providers (sep_value);

CREATE INDEX providers_country_idx ON providers (country);

CREATE INDEX providers_adm0_idx ON providers (adm0);

CREATE INDEX providers_adm1_idx ON providers (adm1);

CREATE INDEX providers_adm2_idx ON providers (adm2);

CREATE INDEX providers_adm3_idx ON providers (adm3);

CREATE INDEX providers_adm4_idx ON providers (adm4);

CREATE INDEX providers_geom_idx ON providers USING GIST (geom);

DROP TABLE IF EXISTS communities_systems_providers CASCADE;

CREATE TABLE communities_systems_providers (
  community_id varchar(26) REFERENCES communities(id) ON DELETE CASCADE,
  system_id varchar(26) REFERENCES systems(id) ON DELETE CASCADE,
  provider_id varchar(26) REFERENCES providers(id) ON DELETE CASCADE,
  served_households integer
);

DROP TABLE IF EXISTS communities_systems_providers_tmp CASCADE;
CREATE TABLE communities_systems_providers_tmp (
  community_id varchar(26),
  system_id varchar(26) ,
  provider_id varchar(26) ,
  served_households integer
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
  shc varchar(1),
  shc_value float,
  staff_women integer,
  staff_men integer,
  students_female integer,
  students_male integer,
  have_toilets boolean,
  version timestamp,
  image_url text,
  country varchar(2),
  adm0 text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX schools_shc_idx ON schools (shc);

CREATE INDEX schools_shc_value_idx ON schools (shc_value);

CREATE INDEX schools_country_idx ON schools (country);

CREATE INDEX schools_adm0_idx ON schools (adm0);

CREATE INDEX schools_adm1_idx ON schools (adm1);

CREATE INDEX schools_adm2_idx ON schools (adm2);

CREATE INDEX schools_adm3_idx ON schools (adm3);

CREATE INDEX schools_adm4_idx ON schools (adm4);

CREATE INDEX schools_geom_idx ON schools USING GIST (geom);

DROP TABLE IF EXISTS communities_schools CASCADE;
CREATE TABLE communities_schools (
  community_id varchar(26) REFERENCES communities(id) ON DELETE CASCADE,
  school_id varchar(26) REFERENCES schools(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS communities_schools_tmp CASCADE;
CREATE TABLE communities_schools_tmp (
  community_id varchar(26),
  school_id varchar(26)
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
  hcc varchar(1),
  hcc_value float,
  staff_women integer,
  staff_men integer,
  have_toilets boolean,
  version timestamp,
  image_url text,
  country varchar(2),
  adm0 text,
  adm1 text,
  adm2 text,
  adm3 text,
  adm4 text
);

CREATE INDEX schools_hcc_idx ON health_centers (hcc);

CREATE INDEX schools_hcc_value_idx ON health_centers (hcc_value);

CREATE INDEX health_centers_country_idx ON health_centers (country);

CREATE INDEX health_centers_adm0_idx ON health_centers (adm0);

CREATE INDEX health_centers_adm1_idx ON health_centers (adm1);

CREATE INDEX health_centers_adm2_idx ON health_centers (adm2);

CREATE INDEX health_centers_adm3_idx ON health_centers (adm3);

CREATE INDEX health_centers_adm4_idx ON health_centers (adm4);

CREATE INDEX health_centers_geom_idx ON health_centers USING GIST (geom);