import { Connection } from 'src/common/constants/connection';
import { CreateSongDTO } from './dto/create-song-dto';
import { SongsService } from './songs.service';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

@Controller('songs')
export class SongsController {
    constructor (
        private songsService: SongsService,
        @Inject("CONNECTION")
        private connection: Connection,
    ) {
        console.log(`This is connection string: ${this.connection.CONNECTION_STRING}`);
    }

    @Post()             // POST - http://localhost:3000/songs
    create(@Body() createSongDTO: CreateSongDTO) {
        return this.songsService.create(createSongDTO);
    }

    @Get()              // GET - http://localhost:3000/songs
    findAll() {
        try {
            return this.songsService.findAll();
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
    ) {
        return `Fetch song on the based on id ${id}`;
    }

    @Put(":id")         // PUT - http://localhost:3000/songs/1
    update() {
        return "Update song on the based on id";
    }
    
    @Delete(":id")      // DELETE - http://localhost:3000/songs/1
    delete() {
        return "Delete song on the based on id";
    }
}
