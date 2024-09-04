import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/user.entity';
import { Playlist } from './playlists/playlist.entity';
import { PlaylistModule } from './playlists/playlists.module';
import { DataSource } from 'typeorm';
const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
    imports: [
        SongsModule,
        PlaylistModule,
        TypeOrmModule.forRoot({     // Config TypeOrmModule to connect database and create tables & relations
            type: 'mysql',
            database: 'nestjs-freeCodeCamp',
            host: 'localhost',
            port: 5000,
            username: 'root',
            password: '123456',
            entities: [Song, Artist, User, Playlist],
            synchronize: true,
        }),
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
    constructor (private dataSource: DataSource) {
        console.log("Database name: ", dataSource.driver.database);
    }

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
