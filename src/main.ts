import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Apply validation pipe for DTO:
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('NestJS Funcamentals APIs')
        .setDescription('NestJS Fundamentals APIs document')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Auto using seeder db (enable whenever need to use):
    // const seedService = app.get(SeedService);
    // await seedService.seed();

    // Using config env:
    const configService = app.get(ConfigService);

    await app.listen(configService.get<number>('port'));

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
