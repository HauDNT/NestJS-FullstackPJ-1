import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {}

    async login(loginDTO: LoginDTO) {
        const user = await this.usersService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

        if (passwordMatched) {
            return HttpStatus.ACCEPTED;
        }
        else
            throw new UnauthorizedException("Password doesn't match");
    }
}
