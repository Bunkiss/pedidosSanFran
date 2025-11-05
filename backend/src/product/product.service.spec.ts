import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: MockRepository<Product>;
  let vendorRepository: MockRepository<Vendor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: createMockRepository() },
        { provide: getRepositoryToken(Vendor), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
    vendorRepository = module.get(getRepositoryToken(Vendor));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto correctamente', async () => {
      const dto = { nombre: 'Pizza', descripcion: 'Grande', precio: 1000, vendorId: 1 };
      const vendor = { id: 1, nombre: 'Pizzeria San Juan' } as Vendor;
      const product = { id: 1, ...dto, vendor } as unknown as Product;
      const { vendorId, ...data } = dto;

      vendorRepository.findOne.mockResolvedValue(vendor);
      productRepository.create.mockReturnValue(product);
      productRepository.save.mockResolvedValue(product);

      const result = await service.create(dto);

      expect(vendorRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.vendorId } });
      expect(productRepository.create).toHaveBeenCalledWith({ ...data, vendor });
      expect(result).toEqual(product);
    });

    it('debería lanzar NotFoundException si el vendor no existe', async () => {
      vendorRepository.findOne.mockResolvedValue(null);
      const dto = { nombre: 'Pizza', descripcion: 'Grande', precio: 1000, vendorId: 99 };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los productos', async () => {
      const products = [{ id: 1, nombre: 'Empanada' }] as Product[];
      productRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(productRepository.find).toHaveBeenCalledWith({
        relations: ['vendor'],
        order: { id: 'ASC' },
      });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('debería retornar un producto existente', async () => {
      const product = { id: 1, nombre: 'Hamburguesa' } as Product;
      productRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      productRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un producto correctamente', async () => {
      const product = { id: 1, nombre: 'Pizza vieja' } as Product;
      const dto = { nombre: 'Pizza nueva', precio: 1200 };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      productRepository.save.mockResolvedValue({ ...product, ...dto });

      const result = await service.update(1, dto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.save).toHaveBeenCalledWith({ ...product, ...dto });
      expect(result).toEqual({ ...product, ...dto });
    });

    it('debería lanzar NotFoundException si el vendor nuevo no existe', async () => {
      const product = { id: 1, nombre: 'Pizza' } as Product;
      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      vendorRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, { vendorId: 999 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto correctamente', async () => {
      const product = { id: 1 } as Product;
      jest.spyOn(service, 'findOne').mockResolvedValue(product);

      await service.remove(1);
      expect(productRepository.remove).toHaveBeenCalledWith(product);
    });
  });
});
