import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request } from '@nestjs/common';
import { TemplateService } from './template.service.js';
import { CreateTemplateDTO, UpdateTemplateDTO } from './dto/template.dto.js';
import { SetErrResponse, SetResponse } from '../hooks/response.js';
import { JWTDecrypt } from '../hooks/ecrypt.js';

@Controller('template')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Post("createtemplate")
    async createTemplate(@Request() req: any, @Body() createTemplateDto: CreateTemplateDTO) {
        try { 
            const userInfo = await JWTDecrypt(req);

            const res = await this.templateService.createTemplate(createTemplateDto, userInfo);
            
            return SetResponse({
                status: 201,
                message: "Creating a new template successfully.",
                body: res,
            });
        } catch (error) {
            return SetErrResponse({
                status: 400,
                message: "Creating a new template failed.",
                err: error,
            });
        }
    }

    @Get("team/:teamId")
    async findTemplatesByTeamId(@Request() req: any, @Param("teamId") teamId: string) {
        try {
            const userInfo = await JWTDecrypt(req);

            const res = await this.templateService.findTemplatesByTeamId(teamId, userInfo);

            return SetResponse({
                status: 200,
                message: "Getting templates by team successfully.",
                body: res,
            });
        } catch (error) {
            return SetErrResponse({
                status: 400,
                message: "Getting templates by team failed.",
                err: error,
            });
        }
    }

    @Get(":templateId")
    async findOneByTemplateId(@Request() req: any, @Param("templateId") templateId: string) {
        try {
            const userInfo = await JWTDecrypt(req);

            const res = await this.templateService.findOneByTemplateId(templateId, userInfo);

            return SetResponse({
                status: 200,
                message: "Getting template successfully.",
                body: res,
            });
        } catch (error) {
            return SetErrResponse({
                status: 400,
                message: "Getting template failed.",
                err: error,
            });
        }
    }

    @Put(":templateId")
    async updateByTemplateId(
        @Request() req: any,
        @Param("templateId") templateId: string,
        @Body() updateTemplateDto: UpdateTemplateDTO,
    ) {
        try {
            const userInfo = await JWTDecrypt(req);

            const res = await this.templateService.updateByTemplateId(templateId, updateTemplateDto, userInfo);

            return SetResponse({
                status: 200,
                message: "Updating template successfully.",
                body: res,
            });
        } catch (error) {
            return SetErrResponse({
                status: 400,
                message: "Updating template failed.",
                err: error,
            });
        }
    }

    @Patch(":templateId")
    async patchByTemplateId(
        @Request() req: any,
        @Param("templateId") templateId: string,
        @Body() updateTemplateDto: UpdateTemplateDTO,
    ) {
        return this.updateByTemplateId(req, templateId, updateTemplateDto);
    }

    @Delete(":templateId")
    async deleteByTemplateId(@Request() req: any, @Param("templateId") templateId: string) {
        try {
            const userInfo = await JWTDecrypt(req);

            const res = await this.templateService.deleteByTemplateId(templateId, userInfo);

            return SetResponse({
                status: 200,
                message: "Deleting template successfully.",
                body: res,
            });
        } catch (error) {
            return SetErrResponse({
                status: 400,
                message: "Deleting template failed.",
                err: error,
            });
        }
    }
}
