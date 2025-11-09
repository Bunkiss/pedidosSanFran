import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';

describe('VendorsService', () => {
  let service: VendorsService;
  let vendorRepo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        {
          provide: getRepositoryToken(Vendor),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
    vendorRepo = module.get<MockRepository>(getRepositoryToken(Vendor));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
    expect(vendorRepo).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar un vendor', async () => {
      const dto = { name: 'Vendor 1' };
      const vendorEntity = { id: 1, ...dto };

      vendorRepo.create.mockReturnValue(vendorEntity);
      vendorRepo.save.mockResolvedValue(vendorEntity);

      const result = await service.create(dto as any);

      expect(vendorRepo.create).toHaveBeenCalledWith(dto);
      expect(vendorRepo.save).toHaveBeenCalledWith(vendorEntity);
      expect(result).toEqual(vendorEntity);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los vendors con relaciones', async () => {
      const vendors = [{ id: 1 }, { id: 2 }];
      vendorRepo.find.mockResolvedValue(vendors);

      const result = await service.findAll();

      expect(vendorRepo.find).toHaveBeenCalledWith({
        relations: ['products', 'user'],
      });
      expect(result).toEqual(vendors);
    });
  });

  describe('findOne', () => {
    it('debería devolver un vendor si existe', async () => {
      const vendor = { id: 1, name: 'Vendor 1' };
      vendorRepo.findOne.mockResolvedValue(vendor);

      const result = await service.findOne(1);

      expect(vendorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['products', 'user'],
      });
      expect(result).toEqual(vendor);
    });

    it('debería lanzar NotFoundException si el vendor no existe', async () => {
      vendorRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un vendor existente', async () => {
      const vendor = { id: 1, name: 'Vendor 1' };
      const dto = { name: 'Nuevo Nombre' };
      const updated = { ...vendor, ...dto };

      jest.spyOn(service, 'findOne').mockResolvedValue(vendor as any);
      vendorRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto as any);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(vendorRepo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('debería eliminar un vendor existente', async () => {
      const vendor = { id: 1, name: 'Vendor 1' };

      jest.spyOn(service, 'findOne').mockResolvedValue(vendor as any);
      vendorRepo.remove.mockResolvedValue(vendor);

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(vendorRepo.remove).toHaveBeenCalledWith(vendor);
      expect(result).toEqual(vendor);
    });
  });

  describe('findAllPublic', () => {
    it('debería devolver todos los vendors públicos con productos', async () => {
      const vendors = [{ id: 1 }, { id: 2 }];
      vendorRepo.find.mockResolvedValue(vendors);

      const result = await service.findAllPublic();

      expect(vendorRepo.find).toHaveBeenCalledWith({
        relations: ['products'],
      });
      expect(result).toEqual(vendors);
    });
  });
});
