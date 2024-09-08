import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt-guard';
import { Enable2FAType } from 'src/common/constants/types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) { }

    @Post('signup')         // http://localhost:3000/auth/signup
    signup(
        @Body()
        userDTO: CreateUserDTO,
    ): Promise<User> {
        return this.userService.create(userDTO);
    }

    @Post('login')
    login(
        @Body()
        loginDTO: LoginDTO,
    ) {
        return this.authService.login(loginDTO);
    }

    @Get('enable-2fa')
    @UseGuards(JwtGuard)
    enable2FA(
        @Request() request,
    ): Promise<Enable2FAType> {
        console.log(request.user);

        return this.authService.enable2FA(request.user.userId);
    }

    @Post('validate-2fa')
    @UseGuards(JwtGuard)
    validate2FA(
        @Request() request,
        @Body() validateTokenDTO: ValidateTokenDTO,
    ): Promise<{ verified: boolean }> {
        return this.authService.validate2FAToken(
            request.user.userId,
            validateTokenDTO.token,
        );
    }

    @Get('disable-2fa')
    @UseGuards(JwtGuard)
    disable2FA(
        @Request() request,
    ): Promise<UpdateResult> {
        return this.authService.disable2FA(request.user.userId);
    }

    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile (
        @Request() req,
    ) {
        delete req.user.password;

        return {
            message: "Authenticated with api key success",
            user: req.user,
        }
    }
}
