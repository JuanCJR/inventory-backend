import { MiddlewareConsumer, Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import config from './config';
import * as Joi from 'joi';
import { LoggerMiddleware } from '@common/utils/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Store } from './entities/store.entity';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { evaluaProducts } from './database/evaluaProducts';
import { schedule } from 'node-cron';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        APP_PORT: Joi.number().required()
      })
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Inventory, User, Store])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  constructor(datasource: DataSource) {
    evaluaProducts(datasource);
    schedule('0 0 0 * * *', async () => {
      await evaluaProducts(datasource);
      Logger.log({
        level: 'info',
        service: 'schedule evaluate products'
      });
    });
  }
}
