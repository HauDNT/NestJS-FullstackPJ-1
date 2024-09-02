import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
    private readonly songs = [];

    create(song) {
        // Save new song in the database
        this.songs.push(song);
    }

    findAll() {
        // Fetch all songs from the database
        // Errors comes while fetching the data
        throw new Error("Error in Database while fetching records");    // 500 - "Internal server error"

        return this.songs;
    }
}
