# COVID-19 REPORTS

## Description

App for visualizing Covid-19 data generated by [mysymptoms.mil](https://www.mysymptoms.mil).

## Getting Started

### Prerequisites

Ensure the following packages are installed.

- [NodeJS 10+](https://nodejs.org/en/)
- [PostgreSQL 12+](https://www.postgresql.org)

### Development

- Create a file named `.env` at project root with the following in it. You can change the `USER_EDIPI` value to any
number greater than 1 to create a new user.
```
USER_EDIPI=1
```

- Navigate to the project root and run the following.
```
npm install
npm run seed-dev
npm run dev
```

### Switching Users

The client uses certificates for login in production rather than a typical login page, which is why we use the
`USER_EDIPI` environment variable as a development workaround. To switch users, change the value of `USER_EDIPI` in
your `.env` file and restart the development server.

### Synchronizing the Database

When modifying database models, it can be useful to continuously sync the database schema during development. To do
so, add the following to your `.env` file:
```
SYNC_DATABASE=true
```

*This functionality can't be used in production, so you'll still need to remember to write migrations to deploy changes
to the schema.*

### Testing

```
npm test
```

### Notes

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app), and uses
[rescripts](https://github.com/harrysolovay/rescripts) to customize the build configuration.

As the project requirements grow, we may need to eject from create-react-app/rescripts. However, they greatly simplify
management of the build configuration, so we should avoid ejecting if possible.
