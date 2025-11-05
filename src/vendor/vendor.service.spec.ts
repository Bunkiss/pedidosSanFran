import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';
import { NotFoundException } from '@nestjs/common';

describe('VendorsService', () => {
  let service: VendorsService;
  let repo: MockRepository<Vendor>;

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
    repo = module.get(getRepositoryToken(Vendor));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

	describe('create', () => {
	it('debería crear un vendor correctamente', async () => {
			const dto = { nombre: 'Bar de Tony', categoria: 'Restaurante', userId: 1 };
			const vendor = { id: 1, ...dto } as unknown as Vendor;

			repo.create.mockReturnValue(vendor);
			repo.save.mockResolvedValue(vendor);

			const result = await service.create(dto);
			expect(repo.create).toHaveBeenCalledWith(dto);
			expect(repo.save).toHaveBeenCalledWith(vendor);
			expect(result).toEqual(vendor);
	});
	});

  describe('findAll', () => {
    it('debería devolver todos los vendors', async () => {
      const vendors = [{ id: 1, nombre: 'Kiosco Mario' }] as Vendor[];
      repo.find.mockResolvedValue(vendors);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['schedules'],
        order: { id: 'ASC' },
      });
      expect(result).toEqual(vendors);
    });
  });

  describe('findOne', () => {
    it('debería devolver un vendor por id', async () => {
      const vendor = { id: 1, nombre: 'Lomitos SRL' } as Vendor;
      repo.findOne.mockResolvedValue(vendor);

      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['schedules'],
      });
      expect(result).toEqual(vendor);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un vendor existente', async () => {
      const vendor = { id: 1, nombre: 'Old', categoria: 'Comida' } as Vendor;
      const dto = { nombre: 'Nuevo' };

      jest.spyOn(service, 'findOne').mockResolvedValue(vendor);
      repo.save.mockResolvedValue({ ...vendor, ...dto });

      const result = await service.update(1, dto);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalledWith({ ...vendor, ...dto });
      expect(result.nombre).toBe('Nuevo');
    });
  });

  describe('remove', () => {
    it('debería eliminar un vendor', async () => {
      const vendor = { id: 1, nombre: 'Para Borrar' } as Vendor;

      jest.spyOn(service, 'findOne').mockResolvedValue(vendor);
      repo.remove.mockResolvedValue(vendor);

      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.remove).toHaveBeenCalledWith(vendor);
    });
  });
});
