import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    register(dto: CreateAuthDto): Promise<{
        message: string;
    }>;
    login(email: string, contraseña: string): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            rol: string;
        };
    }>;
}
