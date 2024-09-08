import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async create(userDTO: CreateUserDTO): Promise<User> {
        const salt = await bcrypt.genSalt();
        userDTO.password = await bcrypt.hash(userDTO.password, salt);
        
        const newUser = await this.usersRepository.save(userDTO);
        delete newUser.password;

        return newUser;
    }

    async findOne(data: LoginDTO): Promise<User> {
        const user = await this.usersRepository.findOneBy({email: data.email});

        if (!user) throw new UnauthorizedException("Could not find user");

        return user;
    }

    async findById(userId: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: userId});

        if (!user) throw new UnauthorizedException("Could not find user");

        return user;
    }

    async updateSecretKey(userId: number, secretKey: string): Promise<UpdateResult> {
        return this.usersRepository.update(
            { id: userId },
            {
                twoFASecret: secretKey,
                enable2FA: true,
            },
        );
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        const user = await this.usersRepository.findOneBy({id: userId});

        if (!user) throw new UnauthorizedException("Could not find user");

        return this.usersRepository.update(
            { id: userId },
            {
                twoFASecret: null,
                enable2FA: false,
            },
        );
    }
}
