import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { Payment } from '../payment/entities/payment.entity';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: MockRepository<Order>; 
  let vendorRepo: MockRepository<Vendor>;
  let userRepo: MockRepository<User>;
  let driverRepo: MockRepository<Driver>;
  let detailRepo: MockRepository<OrderDetail>;
  let paymentRepo: MockRepository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
        { provide: getRepositoryToken(Vendor), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Driver), useValue: createMockRepository() },
        { provide: getRepositoryToken(OrderDetail), useValue: createMockRepository() },
        { provide: getRepositoryToken(Payment), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    vendorRepo = module.get(getRepositoryToken(Vendor));
    userRepo = module.get(getRepositoryToken(User));
    driverRepo = module.get(getRepositoryToken(Driver));
    detailRepo = module.get(getRepositoryToken(OrderDetail));
    paymentRepo = module.get(getRepositoryToken(Payment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una orden con detalles y relaciones', async () => {
      const dto = {
        estado: 'pendiente',
        vendorId: 1,
        userId: 2,
        driverId: 3,
        details: [
          {
            productId: 1,
            cantidad: 2,
            subtotal: 100,
            impuestos: 10,
            propina: 5,
            costo_envio: 20,
            metodo_pago: 'efectivo',
          },
        ],
      };

      const mockOrder = { id: 1, total: 135, ...dto } as unknown as Order;

      vendorRepo.findOneBy.mockResolvedValue({ id: 1 } as Vendor);
      userRepo.findOneBy.mockResolvedValue({ id: 2 } as User);
      driverRepo.findOneBy.mockResolvedValue({ id: 3 } as Driver);
      detailRepo.create.mockReturnValue(dto.details[0] as any);
      orderRepo.create.mockReturnValue({ estado: dto.estado });
      orderRepo.save.mockResolvedValue(mockOrder);

      const result = await service.create(dto as any);

      expect(orderRepo.save).toHaveBeenCalled();
      expect(result.total).toBe(135);
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las órdenes', async () => {
      const mockOrders = [{ id: 1 }] as Order[];
      orderRepo.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(orderRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOne', () => {
    it('debería devolver una orden existente', async () => {
      const mockOrder = { id: 1 } as Order;
      orderRepo.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(orderRepo.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('debería lanzar error si no existe', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una orden existente', async () => {
      const mockOrder = { id: 1, estado: 'pendiente' } as Order;
      orderRepo.findOne.mockResolvedValue(mockOrder);
      orderRepo.save.mockResolvedValue({ ...mockOrder, estado: 'completado' });

      const result = await service.update(1, { estado: 'completado' } as any);

      expect(orderRepo.save).toHaveBeenCalled();
      expect(result.estado).toBe('completado');
    });
  });

  describe('remove', () => {
    it('debería eliminar una orden existente', async () => {
      const mockOrder = { id: 1 } as Order;
      orderRepo.findOne.mockResolvedValue(mockOrder);
      orderRepo.remove.mockResolvedValue(mockOrder);

      const result = await service.remove(1);

      expect(orderRepo.remove).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('payOrder', () => {
    it('debería registrar un pago y actualizar el estado de la orden', async () => {
      const mockOrder = { id: 1, estado: 'pendiente' } as any;
      const mockPayment = { id: 1, monto: 100, metodo: 'efectivo' } as Payment;

      orderRepo.findOne.mockResolvedValue(mockOrder);
      paymentRepo.create.mockReturnValue(mockPayment);
      paymentRepo.save.mockResolvedValue(mockPayment);
      orderRepo.save.mockResolvedValue({ ...mockOrder, estado: 'completado' });

      const result = await service.payOrder(1, { monto: 100, metodo: 'efectivo' } as any);

      expect(paymentRepo.create).toHaveBeenCalled();
      expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ estado: 'completado' }));
      expect(result).toEqual(mockPayment);
    });

    it('debería lanzar error si no existe la orden', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.payOrder(999, { monto: 100, metodo: 'efectivo' } as any))
        .rejects.toThrow(NotFoundException);
    });
  });
});
