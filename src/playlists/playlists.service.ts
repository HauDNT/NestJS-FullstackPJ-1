import { InjectRepository } from "@nestjs/typeorm";
import { Playlist } from "./playlist.entity";
import { Song } from "src/songs/song.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { CreatePlaylistDTO } from "./dto/create-playlist.dto";

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepo: Repository<Playlist>,

        @InjectRepository(Song)
        private songRepo: Repository<Song>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(playlistDTO: CreatePlaylistDTO): Promise<Playlist> {
        const playlist = new Playlist();

        playlist.name = playlistDTO.name;

        // Songs will be the array of ids that we are getting from the DTO object
        const songs = await this.songRepo.findByIds(playlistDTO.songs);

        // Set the relation for the songs with playlist entity
        playlist.songs = songs;

        // A user will be the id of the user we are getting from the request
        // when we implemented the user authentication this id will become the loggedIn user id
        const user = await this.userRepo.findOneById(playlistDTO.user);
        playlist.user = user;

        return this.playlistRepo.save(playlist);
    }
}