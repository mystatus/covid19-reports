# STATUS ENGINE

Web app for visualizing Covid-19 data generated by [mysymptoms.mil](https://www.mysymptoms.mil).


## TOC

- [Prerequisites](#prerequisites)
- [Starting the Application](#starting-the-application)
- [Switching Users](#switching-users)
- [Database Schema Synchronizing](#database-schema-synchronizing)
- [Database Schema Migrations](#database-schema-migrations)
  * [Generating Incremental Migrations](#generating-incremental-migrations)
  * [Creating New Migrations](#creating-new-migrations)
  * [Running Migrations](#running-migrations)
  * [Restoring Schema](#restoring-schema)
- [Testing](#testing)
  * [Options](#options)
- [Notes](#notes)
- [Debugging](#debugging)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## Prerequisites

Ensure the following packages are installed.

- [NodeJS 14+](https://nodejs.org/en/)
- [Yarn 1+](https://yarnpkg.com/)
- [PostgreSQL 12+](https://www.postgresql.org)
  - Alternatively install [Postgres.app](https://postgresapp.com) and
    add `/Applications/Postgres.app/Contents/Versions/13/bin` to your PATH
  - Better yet, install docker-compose and use `yarn run start-db` for local dev


## Starting the Application

- Create a file named `.env` at project root with the following in it. You can change the `USER_EDIPI` value to any
10 digit number greater than 1 to create a new user. `INTERNAL_ACCESS_KEY` is used for local development when working
  with `se-ingest-processor`. It allows the processor to authenticate with the exposed server APIs. `SYNC_DATABASE` is
  described in the [Database Schema Synchronizing](#database-schema-synchronizing) section.
```
USER_EDIPI=0000000001
INTERNAL_ACCESS_KEY=anything
SYNC_DATABASE=false
```

- Navigate to the project root and run the following.
```
yarn install

# Optional if using docker-compose
yarn run start-db

yarn run seed-dev
yarn run dev
```
This will start both the frontend and the backend.

If you need to stop or reset the docker-compose dev database:
```
yarn run stop-db
```

There are a couple of things in the app that won’t work unless you have
elasticsearch/kibana running. If you try to go to the Muster page
you’ll get an internal server error without them running. Anything
involving Workspaces won’t work quite right, since those exist in
ES/Kibana.



## Switching Users

The client uses certificates for login in production rather than a typical login page, which is why we use the
`USER_EDIPI` environment variable as a development workaround. To switch users, change the value of `USER_EDIPI` in
your `.env` file and restart the development server.


## Database Schema Synchronizing

When modifying database models, it can be useful to continuously sync the database schema during development. To do
so, add the following to your `.env` file:
```
SYNC_DATABASE=true
```
This configuration under the covers sets the [synchronize](https://typeorm.delightful.studio/interfaces/_driver_postgres_postgresconnectionoptions_.postgresconnectionoptions.html#synchronize) flag.
When set to `true` it will automatically create the schema on every application launch based on the ORM code directives in this repository.

*This functionality can't be used in production, so you'll still need to remember to write migrations to deploy changes to the schema.*


## Database Schema Migrations

The term migration refers to a file containing SQL statements representing
an iterative change in state of the database schema. On deploy, these statements are executed against
the production database to reflect the schema changes. For more information see [TypeORM](https://typeorm.io/#/migrations) documentation.


[Migration documentation](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations)


### Generating Incremental Migrations
This step is for generating migration files with schema changes you made.

1. Stop the application.
1. Turn schema sync off by setting: `SYNC_DATABASE=false` in the `.env` file
1. Comment out or make sure you did not update `seed-dev.ts` to take advantage of your
   schema changes.
1. Restore the original schema so that the ORM can compare the current schema
   with the ORM schema declared in the code base and generate the migration.
   Execute: `yarn run seed-dev`
1. The recommended way to create a new migration is to run `yarn run migration-generate {name}`, where `{name}`
   is the name of the migration you want to create.
   The script will automatically run migrations to make sure you're up to date, then it will generate a new migration
   for you in `/server/src/migrations` with the necessary changes to match your current models.
1. Make changes to `seed-dev.ts` if needed
1. Start the application: `yarn run dev` and notice that the DB schema matches the ORM schema code
1. Stop the application and close all connections to the DB.
1. If you made changes to `seed-dev.ts` then apply the changes by running:
   `yarn run seed-dev`
1. Notice that the `seed-dev.ts` changes have been applied.


NOTE: There's currently a known bug in TypeORM's migration generator, where it will always add unnecessary alterations
on date columns that use `default: () => 'null'`. So make sure you review the generated migration and remove any of
these unnecessary alterations before committing them (and also format the generated file to match our eslint rules).

Example: `COMMENT ON COLUMN "user_notification_setting"."last_notified_date" IS NULL`

I also noticed these queries are generated `ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null` which I deleted as well.


### Creating New Migrations

If you want to write a migration from scratch, you can create a new blank migration with `yarn run migration-create {name}`,
where `{name}` is the name of the migration you want to create. An empty template will be generated in
`/packages/server/src/migrations`.


### Running Migrations
Once you have a migration created you can run it manually with `yarn run migration-run`.
However, migrations will run automatically on app startup.


### Restoring Schema

If your local database schema falls out of sync with migrations and you want to get back to a clean state, you can
run `yarn run seed-dev`. This will automatically recreate the database, apply the current migrations, and get the app back
into a usable state.


## Testing

- To run backend tests, you'll need to have an instance of Postgres running.
- When initially running tests, a `dds_test` database will automatically be created in Postgres and migrations will be
  run on it.
- After the initial run, tests will not run migrations by default, for the sake of speed. If you have migrations you
  want to run, you can pass the `--clean` flag.
- The test database is cleared **_before_** each test, meaning you can potentially run a single test and look at the
  database afterward to help debug issues.

```bash
yarn test
````

### Options
`--debug` - Prints all logs rather than only 'test' level logs.

`--clean` - Drops, recreates, and migrates the test database before running tests.


## Linting

You can run the linter for the entire project by running `yarn run lint`. Or, if you would prefer to lint a single
subproject, you can run it for that particularly workspace, such as `yarn run server lint`.


## Workspaces

We're using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to simplify sharing functionality/types
across subprojects. Any functions or types that may be useful on both the server and client should be added to the `shared`
subproject and exported in its `index.ts` file.

There are also utility scripts defined in the root `package.json` that will allow you to succinctly run package scripts
in subprojects. So you can execute any of the following from the project root...

- `yarn run client {script-name}`
- `yarn run server {script-name}`
- `yarn run shared {script-name}`


## Notes

The client portion of this project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app), and uses
[craco](https://github.com/gsoft-inc/craco) to customize the client build configuration.

As the project requirements grow, we may need to eject from create-react-app/craco. However, they greatly simplify
management of the build configuration, so we should avoid ejecting if possible.

## Debugging

- Turn on the ORM SQL logging: `export ORM_LOGGING=true`
  - This option is restricted to the local dev environment only
