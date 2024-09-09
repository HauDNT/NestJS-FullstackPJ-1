import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from './playlists/playlists.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions, typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration'
import { validate } from 'env.validation';
const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                '.env.development',
                '.env.production',
            ],
            isGlobal: true,
            load: [configuration],
            validate: validate,
        }),
        AuthModule,
        SongsModule,
        PlaylistModule,
        UsersModule,
        // TypeOrmModule.forRoot(dataSourceOptions),     // Config TypeOrmModule to connect database and create tables & relations
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),     // Config TypeOrmModule to connect database and create tables & relations
        ArtistsModule, 
        SeedModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: DevConfigService,
            useClass: DevConfigService,
        },
        {
            provide: "CONFIG",
            useFactory: () => {
                return process.env.NODE_ENV === "development" ? devConfig : proConfig;
            }
        }
    ],
})
export class AppModule implements NestModule { 
    constructor (private dataSource: DataSource) { }

    configure(consumer: MiddlewareConsumer) {
        // // Option 1
        // consumer.apply(LoggerMiddleware).forRoutes('songs');

        // // Option 2
        // consumer.apply(LoggerMiddleware).forRoutes({    
        //     path: "songs",
        //     method: RequestMethod.POST,
        // });

        // Option 3
        consumer.apply(LoggerMiddleware).forRoutes(SongsController);
    }
}
