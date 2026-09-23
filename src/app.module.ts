import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Datasource } from './libs/datasource.js';
import { TeamController } from './team/team.controller.js';
import { TeamService } from './team/team.service.js';
import { TeamModule } from './team/team.module.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard.js';
import { JwtModule } from '@nestjs/jwt';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    Datasource,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECERT'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'pinly-service',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    TeamModule,
  ],
  controllers: [AppController, TeamController],
  providers: [
    AppService, 
    TeamService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}
