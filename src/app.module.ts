import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './utils/utils.module';
import { getEnvFilePaths, redis } from './config';

@Module({
  imports: [
    UtilsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      load: [redis],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
