<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A Book Rental API built with NestJS & GraphQL</p>
    
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Book Rental API

This repository just demonstrates how to build a Book Rental API using NestJS and GraphQL.

This API is built following the [Code First](https://docs.nestjs.com/graphql/quick-start#code-first) approach.

## 💸 Support Me

If you can 😊

<a href="https://buymeacoffee.com/llehXIrI8g" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important" ></a>

## Features

Here is a list of all the stuff you will see when looking around:

- [Prisma](https://www.prisma.io/)
  - The ORM used to interact with the database.
  - MySQL is the database used in this project.
  - You can view a list of scripts to interact with the database in the `package.json` file.
- [GraphQL](https://graphql.org/)
  - The API is built using GraphQL.
  - It follows the [Code First](https://docs.nestjs.com/graphql/quick-start#code-first) approach.
  - You can view the generated schema in the [`src/schema/gql`](src/schema.gql) file.
- [Authentication](https://docs.nestjs.com/recipes/passport)
  - The project uses [Passport](http://www.passportjs.org/) for authentication.
  - Both the local & JWT strategies are used.
- [Nest AccessControl (Authorization)](https://github.com/nestjsx/nest-access-control)
  - The project uses the `nest-access-control` package for authorization.
  - You can view the roles & permissions in the [`src/core/auth/app.roles.ts`](src/core/auth/app.roles.ts) file.
- [Docker](https://www.docker.com/)
  - The project is dockerized.
  - You can view the [`Dockerfile`](Dockerfile) and [`compose.yml`](/compose.yml) files in the root directory.
- Security Best Practices
  - The project uses [helmet](https://docs.nestjs.com/security/helmet), [hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing), [cors](https://docs.nestjs.com/security/cors), [compression](https://docs.nestjs.com/techniques/compression) & [rate limiting](https://docs.nestjs.com/security/rate-limiting) as described in the NestJS documentation. For creating & updating records, the project uses [class-validator & class-transformer](https://docs.nestjs.com/techniques/validation) withing DTO's & Input types.
- [Cloudinary](https://cloudinary.com/)
  - The project has a cloudinary module that handles file uploads.
- [Configuration](https://docs.nestjs.com/techniques/configuration)
  - The project uses the `config` module to manage environment variables.
  - There is also a `.env.example` file in the root directory.
  - Validation is done on app startup to ensure that there are no missing environment variables.
- [Health Checks](https://docs.nestjs.com/recipes/terminus)
  - The project uses the `@nestjs/terminus` package for health checks.
  - The `/health` endpoint currently ensures that the prisma client has access to the Database & that the Email configuration is correct.
- Custom Decorators
  - The project has a few custom decorators that are used to get the [current user](src/common/decorators/current-user.decorator.ts), get the [cookies](src/common/decorators/cookies.ts) & make a route [public](src/common/decorators/public-route.decorator.ts)
- Email
  - The project uses [Nodemailer](https://nodemailer.com/about/) to send emails.
  - If you check the [email module](src/common/email/email.module.ts), you will see that there is a `templates` directory that contains the email templates. The email service file is responsible for setting up the transporter and sending the emails.
- Logging - Morgan
  - The project uses [Morgan](https://www.npmjs.com/package/morgan) for logging along with NestJS's built-in logger.
  - The logs are stored in the `logs` directory.

## Project setup

### Installation

```sh
# ✨ Auto-detect
npx nypm install
```

```sh
# npm
npm install
```

```sh
# yarn
yarn
```

```sh
# pnpm
pnpm install
```

```sh
# bun
bun install
```

```sh
# deno
deno install
```

### Configuration

Copy the `.env.example` file to `.env` and fill in the required environment variables.

```sh
cp .env.example .env
```

### Database setup

After setting your environment variables, you can run the following command to create the database schema.

```sh
npx prisma db push
```

#### Seed the database(optional)

You can seed the database with some data by running the following command.

```sh
npx prisma db seed
```

## Development

You can start the application in development mode by running the following command.

```sh
npm run dev
```

## Production

You can build the application by running the following command.

```sh
npm run build
```

After building the application, you can start the application in production mode by running the following command.

```sh
npm run start:prod
```

OR

```sh
node dist/main
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Build the application first

```bash
$ npm run build
```

Start the application in production mode

```bash
$ npm run start:prod
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## License

This is [MIT licensed](LICENSE).
