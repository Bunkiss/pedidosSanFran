import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepo: jest.Mocked<Repository<Payment>>;
  let orderRepo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepo = module.get(getRepositoryToken(Payment));
    orderRepo = module.get(getRepositoryToken(Order));
  });

  it('debería crear un pago correctamente', async () => {
    const order = { id: 1, estado: 'pendiente' } as Order;
    const payment = { id: 1 } as Payment;
    orderRepo.findOneBy.mockResolvedValue(order);
    paymentRepo.findOne.mockResolvedValue(null);
    paymentRepo.create.mockReturnValue(payment);
    paymentRepo.save.mockResolvedValue(payment);

    const result = await service.create(1, 'efectivo', 1000);

    expect(paymentRepo.findOne).toHaveBeenCalledWith({ where: { order: { id: 1 } } });
    expect(orderRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(orderRepo.save).toHaveBeenCalledWith({ ...order, estado: 'completado' });
    expect(paymentRepo.create).toHaveBeenCalledWith({
      order,
      metodo: 'efectivo',
      monto: 1000,
      estado: 'completado',
    });
    expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    expect(result).toBe(payment);
  });

  it('debería lanzar BadRequestException si ya existe un pago para la orden', async () => {
    paymentRepo.findOne.mockResolvedValue({ id: 99 } as Payment);
    await expect(service.create(1, 'efectivo', 1000)).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar NotFoundException si la orden no existe', async () => {
    paymentRepo.findOne.mockResolvedValue(null);
    orderRepo.findOneBy.mockResolvedValue(null);
    await expect(service.create(1, 'efectivo', 1000)).rejects.toThrow(NotFoundException);
  });

  it('debería retornar todos los pagos', async () => {
    const payments = [{ id: 1 }] as Payment[];
    paymentRepo.find.mockResolvedValue(payments);

    const result = await service.findAll();

    expect(paymentRepo.find).toHaveBeenCalledWith({ relations: ['order'] });
    expect(result).toBe(payments);
  });

  it('debería retornar un pago existente por id', async () => {
    const payment = { id: 1 } as Payment;
    paymentRepo.findOne.mockResolvedValue(payment);

    const result = await service.findOne(1);

    expect(paymentRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['order'] });
    expect(result).toBe(payment);
  });

  it('debería lanzar NotFoundException si el pago no existe', async () => {
    paymentRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
