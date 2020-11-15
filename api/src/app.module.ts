import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './users/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { BoardModule } from './boards/board/board.module';
import { BoardCommentModule } from './boards/board-comment/board-comment.module';
import { BoardLikeModule } from './boards/board-like/board-like.module';
import { BoardLikeLoader } from './loaders/boards/board-like.loader';
import { BoardCommentLoader } from './loaders/boards/board-comment.loader';
import { UserLoader } from './loaders/boards/user.loader';
import { NoticeModule } from './notices/notice/notice.module';
import { SnsLoader } from './loaders/sns.loader';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DetailLoader } from './loaders/detail.loader';
import { SubscriberLoader } from './loaders/subscriber.loader';
import { SubscribedToLoader } from './loaders/subscribedTo.loader';
import { UserSubscriptionModule } from './users/user-subscription/user-subscription.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SkillModule } from './users/skill/skill.module';
import { UserSkillLoader } from './loaders/user-skill.loader';
import { UserSkillModule } from './users/user-skill/user-skill.module';
import { SkillsLoader } from './loaders/skills.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '../.env' : '../.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number()
          .required()
          .default(3307),
        PORT: Joi.number()
          .required()
          .default(5000),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: ['**(!common)/*.entity.ts'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({
        req,
        res,
        userLoader: UserLoader(),
        boardLikeLoader: BoardLikeLoader(),
        boardCommentLoader: BoardCommentLoader(),
        snsLoader: SnsLoader(),
        detailLoader: DetailLoader(),
        subscriberLoader: SubscriberLoader(),
        subscribedToLoader: SubscribedToLoader(),
        userSkillLoader: UserSkillLoader(),
        skillsLoader: SkillsLoader(),
      }),
      debug: false,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      playground: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          // port: 587,
          // secure: false, // upgrade later with STARTTLS
          auth: {
            user: 'whdtjr2792@gmail.com',
            pass: '!canyou12',
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    CommonModule,
    AuthModule,
    UserSubscriptionModule,
    BoardModule,
    BoardCommentModule,
    BoardLikeModule,
    NoticeModule,
    SkillModule,
    UserSkillModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
