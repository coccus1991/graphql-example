# Graphql example
A simple example of a project based on graphql + SQL-DB (postegres).

## Prerequisites
* docker + docker-compose (if you want to use postgres as container otherwise change the config `ormconfig.json`)
* node >= 14.0.0

## Running the project
Follow the following steps:
* `npm i`
* `npm run postgres-up` (if you want to use postgres as container)
* `npm start`
* Open the browser to http://localhost:3000/graphql
* `npm run postgres-down` - to shut down the docker postgres server