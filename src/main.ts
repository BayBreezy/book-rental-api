import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ForbiddenExceptionFilter } from "./common/exceptions/forbidden.exception";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.set("trust proxy", "loopback");
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  // Enable cookie parser with a secret
  app.use(cookieParser(process.env.COOKIE_SECRET));
  // Enable CORS
  app.enableCors();
  // Enable security headers via helmet
  app.use(helmet({ contentSecurityPolicy: false }));
  // Enable GZIP compression
  app.use(compression());
  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // Catch and log errors not logged by the application
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  // set public folder
  app.useStaticAssets("public");
  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT}`, "Bootstrap");
  Logger.log(
    `GraphQL Playground running on http://localhost:${process.env.PORT}/graphql`,
    "Bootstrap",
  );
}
bootstrap();
