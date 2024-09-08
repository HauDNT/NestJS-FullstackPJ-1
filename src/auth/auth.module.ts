import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthContants } from './auth.contants';
import { JwtStrategy } from './jwt/jwt-strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './api-key/api-key-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('secret_key'), 
                signOptions: {expiresIn: '1d'},
            }),
            inject: [ConfigService],
        }),
        ArtistsModule,
    ],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
