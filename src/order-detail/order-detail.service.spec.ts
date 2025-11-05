import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { OrderDetail } from './entities/order-detail.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';

describe('OrderDetailService', () => {
  let service: OrderDetailService;
  let detailRepo: MockRepository<OrderDetail>;
  let orderRepo: MockRepository<Order>;
  let productRepo: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        { provide: getRepositoryToken(OrderDetail), useValue: createMockRepository() },
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
        { provide: getRepositoryToken(Product), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
    detailRepo = module.get(getRepositoryToken(OrderDetail));
    orderRepo = module.get(getRepositoryToken(Order));
    productRepo = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un detalle de orden correctamente', async () => {
      const dto = {
        productId: 1,
        cantidad: 2,
        subtotal: 100,
        impuestos: 10,
        propina: 5,
        costo_envio: 20,
        metodo_pago: 'efectivo',
      };

      const mockOrder = { id: 1 } as Order;
      const mockProduct = { id: 1 } as Product;
      const mockDetail = { id: 1, ...dto, order: mockOrder, product: mockProduct } as unknown as OrderDetail;

      orderRepo.findOneBy.mockResolvedValue(mockOrder);
      productRepo.findOneBy.mockResolvedValue(mockProduct);
      detailRepo.create.mockReturnValue(mockDetail);
      detailRepo.save.mockResolvedValue(mockDetail);

      const result = await service.create(1, dto as any);

      expect(orderRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: dto.productId });
      expect(detailRepo.create).toHaveBeenCalled();
      expect(detailRepo.save).toHaveBeenCalledWith(mockDetail);
      expect(result).toEqual(mockDetail);
    });

    it('debería lanzar error si no existe la orden', async () => {
      orderRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(1, { productId: 1 } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si no existe el producto', async () => {
      orderRepo.findOneBy.mockResolvedValue({ id: 1 } as Order);
      productRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(1, { productId: 1 } as any)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los detalles', async () => {
      const mockDetails = [{ id: 1 }, { id: 2 }] as OrderDetail[];
      detailRepo.find.mockResolvedValue(mockDetails);

      const result = await service.findAll();

      expect(detailRepo.find).toHaveBeenCalledWith({ relations: ['order', 'product'] });
      expect(result).toEqual(mockDetails);
    });
  });

  describe('findOne', () => {
    it('debería devolver un detalle existente', async () => {
      const mockDetail = { id: 1 } as OrderDetail;
      detailRepo.findOne.mockResolvedValue(mockDetail);

      const result = await service.findOne(1);

      expect(detailRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['order', 'product'],
      });
      expect(result).toEqual(mockDetail);
    });

    it('debería lanzar error si el detalle no existe', async () => {
      detailRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un detalle existente', async () => {
      const mockProduct = { id: 2 } as Product;
      const mockDetail = { id: 1, cantidad: 1, product: { id: 1 } } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockDetail);
      productRepo.findOneBy.mockResolvedValue(mockProduct);
      detailRepo.save.mockResolvedValue({ ...mockDetail, cantidad: 3, product: mockProduct });

      const result = await service.update(1, { cantidad: 3, productId: 2 } as any);

      expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(detailRepo.save).toHaveBeenCalled();
      expect(result.cantidad).toBe(3);
    });

    it('debería lanzar error si el nuevo producto no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as any);
      productRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, { productId: 99 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un detalle existente', async () => {
      const mockDetail = { id: 1 } as OrderDetail;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDetail);
      detailRepo.remove.mockResolvedValue(mockDetail);

      const result = await service.remove(1);

      expect(detailRepo.remove).toHaveBeenCalledWith(mockDetail);
      expect(result).toEqual(mockDetail);
    });
  });
});
