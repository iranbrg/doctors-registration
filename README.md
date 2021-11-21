# doctors-registration

## About The Project

It is a RESTful API for doctors registration. This API supports all CRUD
operations. This project is also meant to be the answer for gcb group's tech
interview.

## Tech Stack

- [Typescript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)
- [Heroku](https://www.heroku.com/)
- [Digital Ocean](https://www.digitalocean.com/)

## How To Contribute

```bash
# Clone the repository
$ git clone https://github.com/iranbrg/doctors-registration.git
$ cd doctors-registration

# Create a new branch from the `staging` and name it following
# semantic branch names (see https://gist.github.com/seunggabi/87f8c722d35cd07deb3f649d45a31082)
$ git checkout staging
$ git checkout -b feat/new-feature

# Commit your changes with semantic commit messages (see https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
$ git add .
$ git commit -m "feat: implement new feature"

# Push your changes to GitHub, open a pull request to `staging` branch and wait for CI.
# Luckly your pull request will be merged.
$ git push origin feat/new-feature
```

## How To Run The Project

```bash
# Clone the repository
$ git clone https://github.com/iranbrg/doctors-registration.git
$ cd doctors-registration

# Install dependencies
$ npm install

# Set enviroment variables. Create a `.env` file in the project's root
# Check `.env.example` to see what needs to be set.
$ cp .env.example .env
$ vim .env

# Run containers with `docker-compose`
$ docker-compose --profile dev up -d

# Run migrations
$ npx prisma migrate dev

# Run the server for development
$ npm run dev
```

## Project Progress

In the `main` branch, one can use the stable version of this API whereas in the
`staging` branch are the latest and more updated features.

The `main` is deployed on Digital Ocean and the `staging` branch
is deployed on Heroku. Any client can consume this API.

PS: The deploy to Digital Ocean is only simulated on CI/CD pipeline with Github
Actions. If I actually deployed this project I'd pay 5 dolars/month and I don't
want to spend this money 😄. However the `staging` branch is in fact deployed to
Heroku because it's free.

- [Staging](https://doctors-registration.herokuapp.com)
- [Production]()

## Documentation

<!-- Maybe use this as an example of how to improve API doc:
https://documenter.getpostman.com/view/3232248/auth0-nodejs-jwt-auth/7LnAi4o
-->
The documentation for this API's endpoints can be found [here](https://documenter.getpostman.com/view/17688858/UVJWqfLa).

A [Potman Collection](./docs/doctors-registration.postman_collection.json) is also available at `docs` directory
