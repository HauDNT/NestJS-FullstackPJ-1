import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";

export class CreatePlaylistDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true})
    readonly songs: [];

    @IsNumber()
    @IsNotEmpty()
    readonly user: number;
}