import { Injectable, Scope } from '@nestjs/common';

@Injectable({
    scope: Scope.TRANSIENT
})   // Đánh dấu đây là một Provider

export class SongsService {
    private readonly songs = [];

    create(song) {
        // Save new song in the database
        this.songs.push(song);
    }

    findAll() {
        // Fetch all songs from the database
        return this.songs;

        // Errors comes while fetching the data
        // throw new Error("Error in Database while fetching records");    // 500 - "Internal server error"
    }
}
