import { Injectable, Scope } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Artist } from 'src/artists/artist.entity';

@Injectable({
    scope: Scope.TRANSIENT
})   // Đánh dấu đây là một Provider

export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistsRepository: Repository<Artist>,
    ) {}

    async create(songDTO: CreateSongDTO): Promise<Song> {
        const newSong = new Song();

        newSong.title = songDTO.title;
        newSong.artists = songDTO.artists;
        newSong.duration = songDTO.duration;
        newSong.lyrics = songDTO.lyrics;
        newSong.releasedDate = songDTO.releasedDate;

        // Find all the artists on the bases on ids
        const artists = await this.artistsRepository.findByIds(songDTO.artists);

        // Set the relation with artist and songs
        newSong.artists = artists;

        return this.songsRepository.save(newSong);
    }

    findAll(): Promise<Song[]> {
        return this.songsRepository.find();
    }

    findOne(id: number): Promise<Song> {
        return this.songsRepository.findOneBy({id});
    }

    update(
        id: number,
        updateSongDTO: UpdateSongDTO
    ): Promise<UpdateResult> {
        return this.songsRepository.update(id, updateSongDTO);
    }

    remove(id: number): Promise<DeleteResult> {
        return this.songsRepository.delete(id);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        const queryBuilder = this.songsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');

        return paginate<Song>(queryBuilder, options);
    }
}
