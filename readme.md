# The Quaker Maps Project

This project will map Quaker communities throughout the world, so that anyone can easily search for Quaker congregations by location and a variety of other criteria - including organizational affiliation, theology, and welcome to groups such as families, LGBT individuals, and people with disabilities.

We release this project to the world under the [+CAL license](https://legaldesign.org/cal-ethical-ip), which helps ensure that our code never used to harm either human rights or the environment. See `LICENSE` for more details.

# Development Setup Guide

## Requirements

* Node 10
* Typescript
* Postgres
* db-migrate

## Installing Dependencies

In the root project directory, run:

```
npm install
```

## Setting up API config:

In the `api` directory:

```
mv .env.example .env
```

Open `.env` and replace the example secrets with your real project secrets.

## Postgres

[Download PostgreSQL](https://www.postgresql.org/download/) and run it locally on your machine. Postgres must be running for the project's API to function correctly.

### Installing db-migrate

Run the following command:

```
npm install -g db-migrate db-migrate-pg
```

### Setting Up a Database Migration with db-migrate

In the `api` directory, run:

```
db-migrate create [name-of-migration] --sql-file
```

You can then compose your SQL migration in the `...-up.sql` file.

Then, run the migration (and also all prior migrations) with this command:

```
db-migrate up
```

### SQL Workbench

SQL Workbench is an optional tool that makes developing with SQL a little more user-friendly. To install SQL Workbench, follow [the instructions laid out here](https://data36.com/install-sql-workbench-postgresql/).

The details of setup may vary slightly depending on your local environment, but the URL needed to connect to your local server will look something like this:

```
jdbc:postgresql://localhost:5432/quaker_maps_dev
```

(The port number will likely be 5432 or 5433.)

## Deployment

_Coming soon_