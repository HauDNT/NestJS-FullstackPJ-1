import { DevConfigService } from './common/providers/DevConfigService';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(
        private devConfigService: DevConfigService,
        @Inject("CONFIG") 
        private config: { port: string }
    ) {}

    getHello(): string {    // http://localhost:3000/
        return `Hello, I'm learning NestJS Fundamentals ${this.devConfigService.getDBHOST()} | PORT = ${this.config.port}`;
    }
}
