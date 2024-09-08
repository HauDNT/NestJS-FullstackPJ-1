import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from 'db/data-source';
const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
    imports: [
        AuthModule,
        SongsModule,
        PlaylistModule,
        UsersModule,
        TypeOrmModule.forRoot(dataSourceOptions),     // Config TypeOrmModule to connect database and create tables & relations
        ArtistsModule,
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
