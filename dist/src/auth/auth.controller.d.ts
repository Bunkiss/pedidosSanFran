import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CreateAuthDto): Promise<{
        message: string;
    }>;
    login(dto: {
        email: string;
        contraseña: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            rol: string;
        };
    }>;
}
