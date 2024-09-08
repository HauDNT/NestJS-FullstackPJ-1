import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Apply validation pipe for DTO:
    app.useGlobalPipes(new ValidationPipe());

    // Auto using seeder db (enable whenever need to use):
    // const seedService = app.get(SeedService);
    // await seedService.seed();

    // Using config env:
    const configService = app.get(ConfigService);

    await app.listen(configService.get<number>('port'));
}
bootstrap();
