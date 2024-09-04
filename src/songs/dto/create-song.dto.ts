import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Artist } from "src/artists/artist.entity";

export class CreateSongDTO {
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    readonly artists: Artist[];

    @IsNotEmpty()
    @IsDateString()
    readonly releasedDate: Date;
    
    @IsNotEmpty()
    @IsMilitaryTime()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}