import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Vendor } from '../vendor/entities/vendor.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { vendorId, ...data } = createProductDto;

    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor con ID ${vendorId} no encontrado`);
    }

    const nuevoProducto = this.productRepository.create({
      ...data,
      vendor,
    });

    return await this.productRepository.save(nuevoProducto);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['vendor'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const producto = await this.productRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }


  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const producto = await this.findOne(id);

    if (updateProductDto.vendorId) {
      const nuevoVendor = await this.vendorRepository.findOne({
        where: { id: updateProductDto.vendorId },
      });

      if (!nuevoVendor) {
        throw new NotFoundException(
          `Vendor con ID ${updateProductDto.vendorId} no encontrado`,
        );
      }

      producto.vendor = nuevoVendor;
    }

 
    Object.assign(producto, updateProductDto);

    return await this.productRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
  }
}
