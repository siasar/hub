# SIASAR Data Hub

A project to collect and display data from the [SIASAR](https://globalsiasar.org) initiative.

### How to run it locally

1. Create a .env file with the following content
   ```
   API_USER=
   API_PASSWORD=
   METABASE_USER=
   METABASE_PASSWORD=
   ```
1. `docker compose build`
1. `docker compose up`
1. `docker compose run data-hub`

Metabase should be running at [http://localhost:3000](http://localhost:3000)
