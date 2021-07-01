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

- [NodeJS 10+](https://nodejs.org/en/)
- [PostgreSQL 12+](https://www.postgresql.org)
  - Alternatively install [Postgres.app](https://postgresapp.com) and
    add `/Applications/Postgres.app/Contents/Versions/13/bin` to your PATH


## Starting the Application

- Create a file named `.env` at project root with the following in it. You can change the `USER_EDIPI` value to any
10 digit number greater than 1 to create a new user.
```
USER_EDIPI=0000000001
```

- Navigate to the project root and run the following.
```
npm install
npm run seed-dev
npm run dev
```
This will start both the frontend and the backend.

In the logs you’ll see [0] and [1] at the start of each line.
[0] is from the server and [1] is from the client.

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
This configuration under the cover sets the [synchronize](https://typeorm.delightful.studio/interfaces/_driver_postgres_postgresconnectionoptions_.postgresconnectionoptions.html#synchronize) flag. When set to `true` it will automatically create the schema on every application launch based on the ORM code directives in this repository.

*This functionality can't be used in production, so you'll still need to remember to write migrations to deploy changes to the schema.*


## Database Schema Migrations

The term migration means generating a file containing SQL statements representing
the current state of the local or any database. These statements are executed against
the production database to reflect the schema changes. For more information see [TypeORM](https://typeorm.io/#/migrations) documentation.


[Migration documentation](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations)


### Generating Incremental Migrations
This step is for generating migration files with schema changes you made.

1. Stop the application.
1. Turn schema sync off by setting: `SYNC_DATABASE=false`
1. Comment out or make sure you did not update `seed-dev.ts` to take advantage of your
   schema changes.
1. Restore the original schema so that the ORM can compare the current schema
   with the ORM schema declared in the code base and generate the migration.
   Execute: `npm run seed-dev`
1. The recommended way to create a new migration is to run `npm run migration-generate {name}`, where `{name}`
   is the name of the migration you want to create.
   The script will automatically run migrations to make sure you're up to date, then it will generate a new migration
   for you in `/server/migrations` with the necessary changes to match your current models.
1. Make changes to `seed-dev.ts` if needed
1. Start the application: `npm run dev` and notice that the DB schema matches the ORM schema code
1. Stop the application and close all connections to the DB.
1. If you made changes to `seed-dev.ts` then apply the changes by running:
   `npm run seed-dev`
1. Notice that the `seed-dev.ts` changes have been applied.


NOTE: There's currently a known bug in TypeORM's migration generator, where it will always add unnecessary alterations
on date columns that use `default: () => 'null'`. So make sure you review the generated migration and remove any of
these unnecessary alterations before committing them (and also format the generated file to match our eslint rules).

Example: `COMMENT ON COLUMN "user_notification_setting"."last_notified_date" IS NULL`

I also noticed these queries are generated `ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null` which I deleted as well.


### Creating New Migrations

If you want to write a migration from scratch, you can create a new blank migration with `npm run migration-create {name}`,
where `{name}` is the name of the migration you want to create. An empty template will be generated in
`/server/migrations`.


### Running Migrations
Once you have a migration created you can run it manually with `npm run migration-run`.
However, migrations will run automatically on app startup.


### Restoring Schema

If your local database schema falls out of sync with migrations and you want to get back to a clean state, you can
run `npm run seed-dev`. This will automatically recreate the database, apply the current migrations, and get the app back
into a usable state.


## Testing

- To run backend tests, you'll need to have an instance of Postgres running.
- When initially running tests, a `dds_test` database will automatically be created in Postgres and migrations will be
  run on it.
- After the initial run, tests will not run migrations by default, for the sake of speed. If you have migrations you
  want to run, you can pass the `--clean` flag.
- The test database is cleared **_before_** each test, meaning you can potentially run a single test and look at the
  database to help debug issues.

```bash
npm test
# or
./run-tests.sh
````

### Options
`--debug` - Prints all logs rather than only 'test' level logs.

`--clean` - Drops, recreates, and migrates the test database before running tests.

## Notes

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app), and uses
[rescripts](https://github.com/harrysolovay/rescripts) to customize the build configuration.

As the project requirements grow, we may need to eject from create-react-app/rescripts. However, they greatly simplify
management of the build configuration, so we should avoid ejecting if possible.

## Debugging

- Turn on the ORM SQL logging: `export ORM_LOGGING=true`
  - This option is restricted to the local dev environment only
