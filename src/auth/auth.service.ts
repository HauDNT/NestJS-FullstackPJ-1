import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from "speakeasy";
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayLoadType } from '../common/constants/types';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistsService: ArtistsService,
    ) { }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string; message: string; }> {
        const user = await this.usersService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

        if (passwordMatched) {
            // Send JWT token to client
            const payload: PayLoadType = { email: user.email, userId: user.id};
            const artist = await this.artistsService.findArtist(user.id);

            if (artist) {
                payload.artistId = artist.id;
            }

            // Verify 2FA
            if (user.enable2FA && user.twoFASecret) {
                // Send the validateToken request link
                // else otherwise sends the json web token in the response

                return {
                    validate2FA: "http://localhost:3000/auth/validate-2fa", // Gửi URL này về phía Frontend thì yêu cầu người dùng đưa mã bảo mật GG Authen và gửi qua đây để nó xác nhận
                    message: "Please sends the one time password/token from Google Authenticator App",
                };
            }

            return {
                accessToken: this.jwtService.sign(payload),
            };
        }
        else
            throw new UnauthorizedException("Password doesn't match");
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.usersService.findById(userId);

        if (user.enable2FA) {
            return { secret: user.twoFASecret };
        }

        const secret = speakeasy.generateSecret();
        console.log(secret);
        
        user.twoFASecret = secret.base32;
        await this.usersService.updateSecretKey(user.id, user.twoFASecret);

        return { secret: user.twoFASecret };
    }

    async validate2FAToken(
        userID: number,
        token: string,
    ): Promise<{ verified: boolean }> {
        try {
            const user = await this.usersService.findById(userID);

            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32',
            });

            if (verified) {
                return { verified: true }
            } else {
                return { verified: false }
            }
        } catch (error) {
            throw new UnauthorizedException("Error verifying token!");
        }
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.usersService.disable2FA(userId);
    }
}
