import { Test, TestingModule } from '@nestjs/testing';
import { VendorScheduleService } from './vendor-schedule.service';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';

describe('VendorScheduleService', () => {
  let service: VendorScheduleService;
  let vendorScheduleRepo: MockRepository<VendorSchedule>;
  let vendorRepo: MockRepository<Vendor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorScheduleService,
        { provide: 'VendorScheduleRepository', useValue: createMockRepository() },
        { provide: 'VendorRepository', useValue: createMockRepository() },
      ],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(VendorSchedule)) return createMockRepository();
        if (token === getRepositoryToken(Vendor)) return createMockRepository();
      })
      .compile();

    service = module.get<VendorScheduleService>(VendorScheduleService);
    vendorScheduleRepo = module.get(getRepositoryToken(VendorSchedule));
    vendorRepo = module.get(getRepositoryToken(Vendor));
  });

  describe('create', () => {
    it('debería crear un horario para un vendor existente', async () => {
      const dto: CreateVendorScheduleDto = {
        dia: 'Lunes',
        horaApertura: '09:00',
        horaCierre: '18:00',
        vendorId: 1,
      };

      const vendor = { id: 1, nombre: 'Vendor 1' } as unknown as Vendor;
      const schedule = { id: 1, ...dto, vendor } as unknown as VendorSchedule;

      vendorRepo.findOne.mockResolvedValue(vendor);
      vendorScheduleRepo.create.mockReturnValue(schedule);
      vendorScheduleRepo.save.mockResolvedValue(schedule);

      const result = await service.create(dto);

      expect(result).toEqual(schedule);
      expect(vendorRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(vendorScheduleRepo.save).toHaveBeenCalledWith(schedule);
    });

    it('debería lanzar error si el vendor no existe', async () => {
      vendorRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          dia: 'Lunes',
          horaApertura: '09:00',
          horaCierre: '18:00',
          vendorId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debería devolver un horario existente', async () => {
      const schedule = { id: 1, dia: 'Lunes' } as unknown as VendorSchedule;
      vendorScheduleRepo.findOne.mockResolvedValue(schedule);

      const result = await service.findOne(1);

      expect(result).toEqual(schedule);
      expect(vendorScheduleRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['vendor'],
      });
    });

    it('debería lanzar error si el horario no existe', async () => {
      vendorScheduleRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un horario existente', async () => {
      const schedule = { id: 1, dia: 'Lunes' } as unknown as VendorSchedule;
      vendorScheduleRepo.findOne.mockResolvedValue(schedule);
      vendorScheduleRepo.save.mockResolvedValue({ ...schedule, dia: 'Martes' });

      const dto: UpdateVendorScheduleDto = { dia: 'Martes' };

      const result = await service.update(1, dto);
      expect(result.dia).toBe('Martes');
      expect(vendorScheduleRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar un horario existente', async () => {
      const schedule = { id: 1 } as unknown as VendorSchedule;
      jest.spyOn(service, 'findOne').mockResolvedValue(schedule);
      vendorScheduleRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(vendorScheduleRepo.remove).toHaveBeenCalledWith(schedule);
    });
  });
});
