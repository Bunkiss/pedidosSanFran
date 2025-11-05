import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { Vendor } from '../vendor/entities/vendor.entity';

@Injectable()
export class VendorScheduleService {
  constructor(
    @InjectRepository(VendorSchedule)
    private readonly vendorScheduleRepository: Repository<VendorSchedule>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(dto: CreateVendorScheduleDto): Promise<VendorSchedule> {
    const vendor = await this.vendorRepository.findOne({ where: { id: dto.vendorId } });
    if (!vendor) throw new NotFoundException(`Vendor con id ${dto.vendorId} no encontrado`);

    const schedule = this.vendorScheduleRepository.create({
      dia: dto.dia,
      horaApertura: dto.horaApertura,
      horaCierre: dto.horaCierre,
      vendor,
    });

    return this.vendorScheduleRepository.save(schedule);
  }

  findAll(): Promise<VendorSchedule[]> {
    return this.vendorScheduleRepository.find({ relations: ['vendor'] });
  }

  async findOne(id: number): Promise<VendorSchedule> {
    const schedule = await this.vendorScheduleRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    if (!schedule) throw new NotFoundException(`Horario con id ${id} no encontrado`);
    return schedule;
  }

  async update(id: number, dto: UpdateVendorScheduleDto): Promise<VendorSchedule> {
    const schedule = await this.findOne(id);

    if (dto.vendorId) {
      const vendor = await this.vendorRepository.findOne({ where: { id: dto.vendorId } });
      if (!vendor) throw new NotFoundException(`Vendor con id ${dto.vendorId} no encontrado`);
      schedule.vendor = vendor;
    }

    Object.assign(schedule, dto);
    return this.vendorScheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.vendorScheduleRepository.remove(schedule);
  }
}

