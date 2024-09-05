import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayLoadType } from './payload.types';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistsService: ArtistsService,
    ) { }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

        if (passwordMatched) {
            // Send JWT token to client
            const payload: PayLoadType = { email: user.email, userId: user.id};

            const artist = await this.artistsService.findArtist(user.id);
            if (artist) {
                payload.artistId = artist.id;
            }

            return {
                accessToken: this.jwtService.sign(payload),
            };
        }
        else
            throw new UnauthorizedException("Password doesn't match");
    }
}
