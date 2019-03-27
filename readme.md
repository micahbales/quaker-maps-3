# The Quaker Maps Project

This project will map Quaker communities throughout the world, so that anyone can easily search for Quaker congregations by location and a variety of other criteria - including organizational affiliation, theology, and welcome to groups such as families, LGBT individuals, and people with disabilities.

We release this project to the world under the [+CAL license](https://legaldesign.org/cal-ethical-ip), which helps ensure that our code never used to harm either human rights or the environment. See `LICENSE` for more details.

# Development Setup Guide

## Requirements

* Node 10
* Typescript 3
* Postgres
* db-migrate

## Setting up API config:

First, make sure your credentials are in place. In the root directory:

```
$ cp .env.dev.example .env.dev
$ cp .env.test.example .env.test
```

Open `.env.dev` and `.env.test` replace the example secrets with your real project secrets.

## Installing Dependencies & Setting Up Databases

### Install Project Dependencies

```
$ npm install -g db-migrate db-migrate-pg
$ npm run install-all
```

### Setting Up Postgres

[Download PostgreSQL](https://www.postgresql.org/download/) and run it locally on your machine. Postgres must be running for the project's API to function correctly.

For Mac Users, install postgres via Homebrew:

```
$ brew install postgresql
```

Then log into psql as the default `postgres` super user (you can set up your own super user if you wish):

```
$ psql postgres
```

You'll be prompted for your user password, and then you may be prompted for the postgres user password, if you've set it.

Once psql opens, create two databases:

```
CREATE DATABASE quaker_maps_dev;
CREATE DATABASE quaker_maps_test;
```

You should now have test and development databases

### Seed Dev and Test Databases

Compile your Typescript assets. Then, run the following commands to migrate and seed both databases:

```
$ db-migrate up -e dev && db-migrate-up -e test
$ npm run seed
```

> Watch Out: When you run migrations, you may encounter an error like this:
> ```
> [ERROR] AssertionError [ERR_ASSERTION]: ifError got unwanted exception: password authentication failed for user <username>
> ```
> If this occurs, your environmental variables are not being set. For a quick-and-dirty fix, you can manually set them like this:
> ```
> $ export PGUSER=<username> $ export PGPASSWORD=<password>
> ```

## Database Quick Start

### Creating Up a New Database Migration with db-migrate

In the root project directory:

```
$ db-migrate create [name-of-migration] --sql-file
```

You can then compose your SQL migration in the `...-up.sql` file.

Make sure to also write a backwards migration to allow rollback, using the `...-down.sql` file.

#### Migrating Development and Test Databases

You'll need to run specific migrations for both the development and test environments. For example, `dev`:

```
$ db-migrate up -e dev
```

And `test`:

```
$ db-migrate up -e test
```

### Seed Local Database with Sample Data

In the root project directory:

```
$ npm run seed
```

### SQL Workbench

SQL Workbench is an optional tool that makes developing with SQL a little more user-friendly. To install SQL Workbench, follow [the instructions laid out here](https://data36.com/install-sql-workbench-postgresql/).

The details of setup may vary slightly depending on your local environment, but the URL needed to connect to your local server will look something like this:

```
jdbc:postgresql://localhost:5432/quaker_maps_dev
```

(The port number will likely be 5432 or 5433.)

You will also need to set the `Driver` to Postgres, and provide your database username and password.

## Deployment to Heroku

This project is currently hosted on Heroku. You can view the deployed project here:

[http://quaker-maps-project.herokuapp.com/](http://quaker-maps-project.herokuapp.com/)

### Setting up Project

If you are deploying this project as a new Heroku app, you'll need to start by creating the app and provisioning a hosted Postgres database. This can be done either from the Heroku website, or via the CLI ([instructions here](https://devcenter.heroku.com/articles/creating-apps) and [here](https://devcenter.heroku.com/articles/heroku-postgresql)).

Make sure to set up `heroku` as a remote for this repo.

### Database Migration

Once the project is successfully deployed to Heroku, there are some special steps that need to be taken to set up our database.

To migrate the database with our initial migration, execute this command from the root project directory on your local machine:

```
$ cat migrations/sqls/20180910231418-initial-migration-up.sql | heroku pg:psql
```

This command outputs the content of our migration, and then pipes it to the psql console for our Heroku database. Repeat this step, in order, for any additional migrations.

### Seed Development Data

Because this project is currently in pre-release development, we are using our test sample dataset in production. Once the database has been migrated you can add this data by following these steps:

1. Open a bash command line 

```
$ heroku run bash
```

2. Run Typescript and Seed Database

```
$ tsc && npm run seed
```

### Refresh Development Data

In the course of development, it may be useful to reset your local data. You can easily do this by running

```
$ npm run reset-dev
```
