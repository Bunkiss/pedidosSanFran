import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { createMockRepository, MockRepository } from '../../test/utils/test-mocks';
import { CreateAuthDto } from './dto/create-auth.dto';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: MockRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepo = createMockRepository();
    jwtService = { sign: jest.fn() } as any;
    service = new AuthService(userRepo as any, jwtService);
  });

  describe('register', () => {
    it('debe hashear la contraseña y registrar el usuario', async () => {
      const dto: CreateAuthDto = {
        nombre: 'Juan',
        email: 'test@example.com',
        contraseña: '123456',
        rol: 'cliente',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
      userRepo.create.mockReturnValue({ ...dto, contraseña: 'hashed123' });
      userRepo.save.mockResolvedValue({ id: 1, ...dto, contraseña: 'hashed123' });

      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.contraseña, 10);
      expect(userRepo.create).toHaveBeenCalledWith({ ...dto, contraseña: 'hashed123' });
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Usuario registrado con éxito' });
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const contraseña = '123456';

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login(email, contraseña)).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si la contraseña no coincide', async () => {
      const user = { id: 1, email, contraseña: 'hashed123', rol: 'cliente' } as User;
      userRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(email, contraseña)).rejects.toThrow(UnauthorizedException);
    });

    it('debe devolver token y datos del usuario si todo es correcto', async () => {
      const user = { id: 1, email, contraseña: 'hashed123', rol: 'cliente' } as User;
      const token = 'jwt.token.aqui';
      userRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await service.login(email, contraseña);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(contraseña, user.contraseña);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        rol: user.rol,
      });
      expect(result).toEqual({
        token,
        user: { id: user.id, email: user.email, rol: user.rol },
      });
    });
  });
});
