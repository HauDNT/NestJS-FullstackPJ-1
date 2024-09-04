import { Injectable, Scope } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song.dto';

@Injectable({
    scope: Scope.TRANSIENT
})   // Đánh dấu đây là một Provider

export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) {}

    create(songDTO: CreateSongDTO): Promise<Song> {
        const newSong = new Song();

        newSong.title = songDTO.title;
        newSong.artists = songDTO.artists;
        newSong.duration = songDTO.duration;
        newSong.lyrics = songDTO.lyrics;
        newSong.releasedDate = songDTO.releasedDate;

        return this.songsRepository.save(newSong);
    }

    findAll(): Promise<Song[]> {
        return this.songsRepository.find();
    }

    findOne(id: number): Promise<Song> {
        return this.songsRepository.findOneBy({id});
    }

    async update(
        id: number,
        updateSongDTO: UpdateSongDTO
    ): Promise<UpdateResult> {
        return this.songsRepository.update(id, updateSongDTO);
    }

    remove(id: number): Promise<DeleteResult> {
        return this.songsRepository.delete(id);
    }
}
