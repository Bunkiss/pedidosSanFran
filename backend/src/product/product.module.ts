import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Vendor])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

