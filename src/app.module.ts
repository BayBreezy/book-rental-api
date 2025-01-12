import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { depthLimit } from "@graphile/depth-limit";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ThrottlerModule } from "@nestjs/throttler";
import { FileSystemStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import {
  loggingMiddleware,
  PrismaModule,
  providePrismaClientExceptionFilter,
  QueryInfo,
} from "nestjs-prisma";
import { CommonModule } from "./common/common.module";
import { ComplexityPlugin } from "./common/complexity.plugin";
import { validate } from "./common/env.validation";
import { GqlThrottlerGuard } from "./common/guards/gql-throttle.guard";
import { AccessControlGuard } from "./core/auth/guards";
import { GqlJwtAuthGuard } from "./core/auth/guards/jwt.guard";
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [
        // Uncomment the following lines to enable the Apollo Studio for different environments
        // process.env.NODE_ENV === "production"
        //   ? ApolloServerPluginLandingPageProductionDefault({})
        //   : ApolloServerPluginLandingPageLocalDefault({}),
        ApolloServerPluginLandingPageLocalDefault(),
      ],
      autoSchemaFile: "src/schema.gql",
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        Logger.error(error.message, "GraphQL");
        return {
          message: error.message,
          code: error.extensions?.code,
          status: (error.extensions?.originalError as any)?.status,
          path: error.path,
        };
      },
      introspection: true,
      hideSchemaDetailsFromClientErrors: true,
      includeStacktraceInErrorResponses: false,
      validationRules: [depthLimit({ maxDepth: 5 })],
    }),
    NestjsFormDataModule.config({ isGlobal: true, storage: FileSystemStoredFile }),
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1e3, limit: 3, blockDuration: 5e3 },
      { name: "medium", ttl: 1e4, limit: 30 },
      { name: "long", ttl: 6e4, limit: 100 },
    ]),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger("PrismaMiddleware"),
            logLevel: "log", // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, validate }),
    CommonModule,
    CoreModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
    { provide: APP_GUARD, useClass: GqlJwtAuthGuard },
    { provide: APP_GUARD, useClass: AccessControlGuard },
    providePrismaClientExceptionFilter(),
    ComplexityPlugin,
  ],
})
export class AppModule {}
