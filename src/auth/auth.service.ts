import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

        console.log(user);
        

        if (passwordMatched) {
            // Send JWT token to client
            const payload = { email: user.email, sub: user.id };
            return {
                accessToken: this.jwtService.sign(payload),
            };
        }
        else
            throw new UnauthorizedException("Password doesn't match");
    }
}
