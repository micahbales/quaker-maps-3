# The Quaker Maps Project

This project will map Quaker communities throughout the world, so that anyone can easily search for Quaker congregations by location and a variety of other criteria - including organizational affiliation, theology, and welcome to groups such as families, LGBT individuals, and people with disabilities.

We release this project to the world under the [+CAL license](https://legaldesign.org/cal-ethical-ip), which helps ensure that our code never used to harm either human rights or the environment. See `LICENSE` for more details.

# Development Setup Guide

## Requirements

* Node 10
* Typescript
* Postgres
* db-migrate

## Installing Dependencies & Setting Up Databases

To install all dependencies, run database migrations, and seed test and dev databases with sample data, run:

```
npm run install-all
cd api
db-migrate up -e dev && db-migrate-up -e test
npm run seed
```

## Setting up API config:

In the root directory:

```
cp .env.dev.example .env.dev
cp .env.test.example .env.test
```

Open `.env.dev` and `.env.test` replace the example secrets with your real project secrets.

## Postgres

[Download PostgreSQL](https://www.postgresql.org/download/) and run it locally on your machine. Postgres must be running for the project's API to function correctly.

### Installing db-migrate

```
npm install -g db-migrate db-migrate-pg
```

### Creating Up a New Database Migration with db-migrate

In the root project directory, run:

```
db-migrate create [name-of-migration] --sql-file
```

You can then compose your SQL migration in the `...-up.sql` file.

Make sure to also write a backwards migration to allow rollback, using the `...-down.sql` file.

#### Migrating Development and Test Databases

You'll need to run specific migrations for both the development and test environments. For example, `dev`:

```
db-migrate up -e dev
```

And `test`:

```
db-migrate up -e test
```

### Seed Local Database with Sample Data

In the root project directory, run:

```
npm run seed
```

### SQL Workbench

SQL Workbench is an optional tool that makes developing with SQL a little more user-friendly. To install SQL Workbench, follow [the instructions laid out here](https://data36.com/install-sql-workbench-postgresql/).

The details of setup may vary slightly depending on your local environment, but the URL needed to connect to your local server will look something like this:

```
jdbc:postgresql://localhost:5432/quaker_maps_dev
```

(The port number will likely be 5432 or 5433.)

You will also need to set the `Driver` to Postgres, and provide your database username and password.

## Deployment

_Coming soon_
