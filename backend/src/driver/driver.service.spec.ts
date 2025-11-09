import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { IsNull } from 'typeorm';

describe('DriverService', () => {
  let service: DriverService;
  let driverRepo: MockRepository;
  let userRepo: MockRepository;
  let orderRepo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        { provide: getRepositoryToken(Driver), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    driverRepo = module.get(getRepositoryToken(Driver));
    userRepo = module.get(getRepositoryToken(User));
    orderRepo = module.get(getRepositoryToken(Order));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un driver asociado a un usuario existente', async () => {
      const dto = { userId: 1 };
      const user = { id: 1, nombre: 'Juan' };

      userRepo.findOne.mockResolvedValue(user);
      driverRepo.create.mockReturnValue({ user });
      driverRepo.save.mockResolvedValue({ id: 10, user });

      const result = await service.create(dto as any);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(driverRepo.create).toHaveBeenCalledWith({ user });
      expect(driverRepo.save).toHaveBeenCalledWith({ user });
      expect(result).toEqual({ id: 10, user });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ userId: 99 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los drivers con vehículos', async () => {
      const drivers = [{ id: 1 }, { id: 2 }];
      driverRepo.find.mockResolvedValue(drivers);

      const result = await service.findAll();

      expect(driverRepo.find).toHaveBeenCalledWith({ relations: ['vehicles'] });
      expect(result).toEqual(drivers);
    });
  });

  describe('findOne', () => {
    it('debe retornar un driver por id', async () => {
      const driver = { id: 1, user: {}, vehicles: [] };
      driverRepo.findOne.mockResolvedValue(driver);

      const result = await service.findOne(1);

      expect(driverRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'vehicles'],
      });
      expect(result).toBe(driver);
    });

    it('debe lanzar NotFoundException si el driver no existe', async () => {
      driverRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un driver existente', async () => {
      const driver = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(driver as any);
      driverRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(driverRepo.remove).toHaveBeenCalledWith(driver);
    });
  });

  describe('findAvailableOrders', () => {
    it('debe retornar pedidos pendientes sin driver', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findAvailableOrders();

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { estado: 'pendiente', driver: IsNull() },
        relations: ['vendor', 'client', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });

  describe('acceptOrder', () => {
    it('debe asignar un pedido pendiente a un driver', async () => {
      const driver = { id: 1 };
      const order = { id: 5, estado: 'pendiente', driver: null };

      driverRepo.findOne.mockResolvedValue(driver);
      orderRepo.findOne.mockResolvedValue(order);
      orderRepo.save.mockResolvedValue({ ...order, driver, estado: 'en_camino' });

      const result = await service.acceptOrder(1, 5);

      expect(driverRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(orderRepo.findOne).toHaveBeenCalledWith({ where: { id: 5 }, relations: ['driver'] });
      expect(orderRepo.save).toHaveBeenCalledWith({ ...order, driver, estado: 'en_camino' });
      expect(result.estado).toBe('en_camino');
    });

    it('debe lanzar NotFoundException si el driver no existe', async () => {
      driverRepo.findOne.mockResolvedValue(null);
      await expect(service.acceptOrder(99, 5)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el pedido no existe', async () => {
      driverRepo.findOne.mockResolvedValue({ id: 1 });
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.acceptOrder(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequest si el pedido ya fue asignado', async () => {
      const driver = { id: 1 };
      const order = { id: 5, estado: 'pendiente', driver: { id: 7 } };

      driverRepo.findOne.mockResolvedValue(driver);
      orderRepo.findOne.mockResolvedValue(order);

      await expect(service.acceptOrder(1, 5)).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequest si el pedido no está pendiente', async () => {
      const driver = { id: 1 };
      const order = { id: 5, estado: 'completado', driver: null };

      driverRepo.findOne.mockResolvedValue(driver);
      orderRepo.findOne.mockResolvedValue(order);

      await expect(service.acceptOrder(1, 5)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOrdersByDriver', () => {
    it('debe retornar pedidos asignados al driver', async () => {
      const driver = { id: 1 };
      const orders = [{ id: 10 }];

      driverRepo.findOne.mockResolvedValue(driver);
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findOrdersByDriver(1);

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { driver: { id: 1 } },
        relations: ['vendor', 'client', 'details', 'details.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });

    it('debe lanzar NotFoundException si el driver no existe', async () => {
      driverRepo.findOne.mockResolvedValue(null);
      await expect(service.findOrdersByDriver(99)).rejects.toThrow(NotFoundException);
    });
  });
});
