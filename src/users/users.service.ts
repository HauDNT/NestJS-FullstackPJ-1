import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import { LoginDTO } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async findByApiKey(apiKey: string): Promise<User> {
        return this.usersRepository.findOneBy({ apiKey });
    }

    async create(userDTO: CreateUserDTO): Promise<User> {
        let newUser = new User();
        newUser.firstName = userDTO.firstName;
        newUser.lastName = userDTO.lastName;
        newUser.email = userDTO.email;
        newUser.apiKey = uuid4();

        const salt = await bcrypt.genSalt();
        newUser.password = await bcrypt.hash(userDTO.password, salt);
        
        const savedUser = await this.usersRepository.save(newUser);
        delete savedUser.password;

        return savedUser;
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
