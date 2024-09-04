import { Module } from "@nestjs/common";
import { PlaylistController } from "./playlists.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Playlist } from "./playlist.entity";
import { PlaylistsService } from "./playlists.service";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
    controllers: [PlaylistController],
    providers: [PlaylistsService],
})
export class PlaylistModule { }