import { CreateSongDTO } from './dto/create-song.dto';
import { SongsService } from './songs.service';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Request, Scope, UseGuards } from '@nestjs/common';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJWTGuard } from 'src/auth/jwt/artists-jwt-guard';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';

@Controller({
    path: 'songs',
    scope: Scope.REQUEST
})

export class SongsController {
    constructor (
        private songsService: SongsService,
    ) { }

    @Post()             // POST - http://localhost:3000/songs
    @UseGuards(ArtistJWTGuard)
    create(
        @Body() createSongDTO: CreateSongDTO,
        @Request() request,
    ): Promise<Song> {
        console.log(request.user);
        
        return this.songsService.create(createSongDTO);
    }

    @Get()              // GET - http://localhost:3000/songs | http://localhost:3000/songs?page=x&limit=y
    @UseGuards(JwtGuard)
    findAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe)
        page = 1,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit = 10,
    ): Promise<Pagination<Song>> {
        try {
            limit = limit > 100 ? 100 : limit;
            return this.songsService.paginate({
                page, 
                limit,
            });
        } catch (error) {
            throw new HttpException(
                "Server error", 
                HttpStatus.INTERNAL_SERVER_ERROR, {
                    cause: error,
                });
        }
    }

    @Get(":id")         // GET - http://localhost:3000/songs/1
    findOne(
        @Param(
            "id",
            new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
        )
        id: number,
    ): Promise<Song> {
        return this.songsService.findOne(id);
    }

    @Put(":id")         // PUT - http://localhost:3000/songs/1
    update(
        @Param(
            "id",
            new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
        )
        id: number,
        @Body() updateSongDTO: UpdateSongDTO,
    ): Promise<Song> {
        return this.songsService.update(id, updateSongDTO);
    }
    
    @Delete(":id")      // DELETE - http://localhost:3000/songs/1
    delete(
        @Param(
            "id",
            new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
        )
        id: number,
    ): Promise<DeleteResult> {
        return this.songsService.remove(id);
    }
}
