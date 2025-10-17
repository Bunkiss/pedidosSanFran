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
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const nuevoVendor = this.vendorRepository.create(createVendorDto);
    return await this.vendorRepository.save(nuevoVendor);
  }

  async findAll(): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      relations: ['schedules'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor con ID ${id} no encontrado`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateVendorDto);
    return await this.vendorRepository.save(vendor);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.remove(vendor);
  }
}
