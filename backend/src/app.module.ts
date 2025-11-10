import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { VendorsModule } from './vendor/vendors.module';
import { VendorScheduleModule } from './vendor-schedule/vendor-schedule.module';
import { ProductModule } from './product/product.module';
import { DriverModule } from './driver/driver.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({

      envFilePath: `.env.${process.env.NODE_ENV}`,

      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'test',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    VendorsModule,
    VendorScheduleModule,
    ProductModule,
    DriverModule,
    VehicleModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
