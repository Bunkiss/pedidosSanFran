jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

const createMockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
};

const bcryptMock = bcrypt as unknown as {
  hash: jest.Mock;
  compare: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let driverRepo: any;
  let vendorRepo: any;

  beforeEach(async () => {
    bcryptMock.hash.mockResolvedValue('hashed-pass');
    bcryptMock.compare.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Driver), useValue: createMockRepository() },
        { provide: getRepositoryToken(Vendor), useValue: createMockRepository() },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    driverRepo = module.get(getRepositoryToken(Driver));
    vendorRepo = module.get(getRepositoryToken(Vendor));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = {
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: '123456',
      rol: 'driver' as const,
    };

    it('debería lanzar error si el correo ya existe', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, email: dto.email });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    });

    it('debería crear usuario, guardar y devolver token', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({ ...dto });
      userRepo.save.mockResolvedValue({ id: 1, ...dto });
      driverRepo.create.mockReturnValue({ user: { id: 1 } });
      driverRepo.save.mockResolvedValue({ id: 10, user: { id: 1 } });

      const result = await service.register(dto);

      expect(result).toEqual({
        success: true,
        user: expect.objectContaining({ id: 1, email: dto.email }),
        token: 'fake-jwt-token',
      });

      expect(bcryptMock.hash).toHaveBeenCalledWith(dto.contraseña, 10);
      expect(userRepo.save).toHaveBeenCalled();
      expect(driverRepo.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: 'hashed-pass',
      rol: 'vendor',
      vendor: null,
      driver: null,
    };

    it('debería lanzar error si el usuario no existe', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login('noexiste@test.com', '123456')).rejects.toThrow(BadRequestException);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'noexiste@test.com' },
        relations: ['vendor', 'driver'],
      });
    });

    it('debería lanzar error si la contraseña no coincide', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(service.login(mockUser.email, 'wrong')).rejects.toThrow(BadRequestException);
      expect(bcryptMock.compare).toHaveBeenCalled();
    });

    it('debería crear vendor si el usuario es vendor sin vendor asignado', async () => {
      userRepo.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ ...mockUser, vendor: { id: 20 } });

      bcryptMock.compare.mockResolvedValue(true);
      vendorRepo.create.mockReturnValue({ id: 20, user: mockUser });
      vendorRepo.save.mockResolvedValue({ id: 20, user: mockUser });

      const result = await service.login(mockUser.email, '123456');

      expect(vendorRepo.create).toHaveBeenCalled();
      expect(vendorRepo.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.token).toBe('fake-jwt-token');
      expect(result.user).toMatchObject({
        id: 1,
        email: mockUser.email,
        rol: 'vendor',
        vendorId: 20,
      });
    });

    it('debería crear driver si el usuario es driver sin driver asignado', async () => {
      const driverUser = { ...mockUser, rol: 'driver', driver: null };
      userRepo.findOne
        .mockResolvedValueOnce(driverUser)
        .mockResolvedValueOnce({ ...driverUser, driver: { id: 30 } });

      bcryptMock.compare.mockResolvedValue(true);
      driverRepo.create.mockReturnValue({ id: 30, user: driverUser });
      driverRepo.save.mockResolvedValue({ id: 30, user: driverUser });

      const result = await service.login(driverUser.email, '123456');

      expect(driverRepo.create).toHaveBeenCalled();
      expect(driverRepo.save).toHaveBeenCalled();
      expect(result.user.driverId).toBe(30);
    });
  });
});
