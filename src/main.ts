import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Apply validation pipe for DTO:
    app.useGlobalPipes(new ValidationPipe());

    // Auto using seeder db (enable whenever need to use):
    // const seedService = app.get(SeedService);
    // await seedService.seed();

    await app.listen(3000);
}
bootstrap();
