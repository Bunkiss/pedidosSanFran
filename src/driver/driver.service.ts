import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDriverDto): Promise<Driver> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`);
    }

    const driver = this.driverRepo.create({ user });
    return await this.driverRepo.save(driver);
  }

  findAll(): Promise<Driver[]> {
    return this.driverRepo.find({ relations: ['vehicles'] });
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepo.findOne({
      where: { id },
      relations: ['user', 'vehicles'],
    });
    if (!driver) throw new NotFoundException(`Driver con ID ${id} no encontrado`);
    return driver;
  }

  async remove(id: number): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepo.remove(driver);
  }
}
