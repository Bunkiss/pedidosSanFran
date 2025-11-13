import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}

  async create(dto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepo.find({
      relations: ['products', 'user'],
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['products', 'user'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor con ID ${id} no encontrado`);
    }

    return vendor;
  }

  async update(id: number, dto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, dto);
    return this.vendorRepo.save(vendor);
  }

  async remove(id: number) {
    const vendor = await this.findOne(id);
    return this.vendorRepo.remove(vendor);
  }

  async findAllPublic(): Promise<Vendor[]> {
    return this.vendorRepo.find({
      // Si tenés columna `estado`, mantené esto. Si no, borrá la línea `where: { estado: 1 },`
      // where: { estado: 1 },
      relations: ['products'],
    });
  }
}
