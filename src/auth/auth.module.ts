import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthContants } from './auth.contants';
import { JwtStrategy } from './jwt/jwt-strategy';

@Module({
    imports: [
        UsersModule, 
        JwtModule.register({
            secret: AuthContants.secretKey, 
            signOptions: {expiresIn: '1d'}
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
