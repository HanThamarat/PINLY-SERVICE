import { IsOptional, IsString, MinLength, IsBoolean } from "class-validator";

export class CreateNewTeamDTO {
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    teamName: string

    @IsOptional()
    @IsString()
    descrition?: string

    @IsOptional()
    @IsBoolean()
    status?: boolean
}