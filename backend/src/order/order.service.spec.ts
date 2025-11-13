import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';
import { NotFoundException } from '@nestjs/common';
import { IsNull } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: MockRepository;
  let vendorRepo: MockRepository;
  let userRepo: MockRepository;
  let driverRepo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
        { provide: getRepositoryToken(Vendor), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Driver), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    vendorRepo = module.get(getRepositoryToken(Vendor));
    userRepo = module.get(getRepositoryToken(User));
    driverRepo = module.get(getRepositoryToken(Driver));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debe crear un pedido con vendor y client válidos', async () => {
      const dto = { vendorId: 1, clientId: 2 };
      const vendor = { id: 1 };
      const client = { id: 2 };
      const createdOrder = { id: 10, estado: 'pendiente', vendor, client };

      vendorRepo.findOne.mockResolvedValue(vendor);
      userRepo.findOne.mockResolvedValue(client);
      orderRepo.create.mockReturnValue(createdOrder);
      orderRepo.save.mockResolvedValue(createdOrder);

      const result = await service.create(dto as any);

      expect(vendorRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(orderRepo.create).toHaveBeenCalledWith({ ...dto, vendor, client, estado: 'pendiente' });
      expect(orderRepo.save).toHaveBeenCalledWith(createdOrder);
      expect(result).toEqual(createdOrder);
    });

    it('debe lanzar NotFoundException si el vendor no existe', async () => {
      vendorRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ vendorId: 1, clientId: 2 } as any)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el client no existe', async () => {
      vendorRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ vendorId: 1, clientId: 2 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los pedidos con relaciones', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(orderRepo.find).toHaveBeenCalledWith({
        relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('debe retornar un pedido existente', async () => {
      const order = { id: 1 };
      orderRepo.findOne.mockResolvedValue(order);

      const result = await service.findOne(1);

      expect(orderRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
      });
      expect(result).toBe(order);
    });

    it('debe lanzar NotFoundException si no se encuentra el pedido', async () => {
      orderRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAvailable', () => {
    it('debe retornar pedidos pendientes sin driver asignado', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findAvailable();

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { estado: 'confirmado', driver: IsNull() },
        relations: ['vendor', 'client', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findByVendor', () => {
    it('debe retornar pedidos del vendor indicado', async () => {
      const orders = [{ id: 1 }];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findByVendor(3);

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { vendor: { id: 3 } },
        relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findByClient', () => {
    it('debe retornar pedidos del cliente indicado', async () => {
      const orders = [{ id: 1 }];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findByClient(5);

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { client: { id: 5 } },
        relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findByDriver', () => {
    it('debe retornar pedidos del driver indicado', async () => {
      const driver = { id: 1 };
      const orders = [{ id: 2 }];

      driverRepo.findOne.mockResolvedValue(driver);
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findByDriver(1);

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { driver: { id: 1 } },
        relations: ['vendor', 'client', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });

    it('debe lanzar NotFoundException si el driver no existe', async () => {
      driverRepo.findOne.mockResolvedValue(null);
      await expect(service.findByDriver(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un pedido existente', async () => {
      const order = { id: 1, estado: 'pendiente' };
      const dto = { estado: 'en_camino' };
      jest.spyOn(service, 'findOne').mockResolvedValue(order as any);
      orderRepo.save.mockResolvedValue({ ...order, ...dto });

      const result = await service.update(1, dto as any);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(orderRepo.save).toHaveBeenCalledWith({ ...order, ...dto });
      expect(result.estado).toBe('en_camino');
    });
  });

  describe('updateStatus', () => {
    it('debe actualizar el estado de un pedido existente', async () => {
      const order = { id: 1, estado: 'pendiente' };
      orderRepo.findOne.mockResolvedValue(order);
      orderRepo.save = jest.fn();

      await service.updateStatus(1, 'confirmado');

      expect(orderRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(order.estado).toBe('confirmado');
    });

    it('debe lanzar NotFoundException si el pedido no existe', async () => {
      orderRepo.findOne.mockResolvedValue(null);
      await expect(service.updateStatus(999, 'entregado')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un pedido existente', async () => {
      const order = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(order as any);
      orderRepo.remove.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(orderRepo.remove).toHaveBeenCalledWith(order);
      expect(result).toEqual({ message: 'Pedido eliminado correctamente' });
    });
  });

  describe('payOrder', () => {
    it('debe marcar un pedido como confirmado y guardar', async () => {
      const order = { id: 1, estado: 'en_camino' };
      jest.spyOn(service, 'findOne').mockResolvedValue(order as any);
      orderRepo.save.mockResolvedValue({ ...order, estado: 'confirmado' });

      const result = await service.payOrder(1, {});

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(orderRepo.save).toHaveBeenCalledWith({ ...order, estado: 'confirmado' });
      expect(result.message).toBe('Pago registrado correctamente. Pedido confirmado ✅');
    });
  });
});
