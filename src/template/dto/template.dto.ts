import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateTemplateDTO {
    @IsString()
    teamId: string

    @IsString()
    @MinLength(3, { message : 'Name must be at least 3 characters long' })
    templateName: string

    @IsOptional()
    @IsString()
    description: string
}

export class UpdateTemplateDTO {
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    templateName?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    templateDescription?: string
}