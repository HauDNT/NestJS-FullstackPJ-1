import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthContants } from "../auth.contants";
import { PayLoadType } from "../payload.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: AuthContants.secretKey,
        });
    }

    async validate(payload: PayLoadType) {
        return {
            userId: payload.userId,
            email: payload.email,
            artistId: payload.artistId,
        };
    }
}