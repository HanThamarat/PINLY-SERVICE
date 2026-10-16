import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTemplateDTO, UpdateTemplateDTO } from './dto/template.dto.js';
import { Templates } from './entitles/template.js';
import { UserInfoType } from '../hooks/ecrypt.js';
import { findUserInTeam } from '../database/querys/team/team.js';

@Injectable()
export class TemplateService {
    constructor(private readonly dataSource: DataSource) {}

    async createTemplate(dto: CreateTemplateDTO, user: UserInfoType) {
        try {
            const recheckTeamId = await findUserInTeam({
                teamId: dto.teamId,
                user: user,
                datasource: this.dataSource,
            });
        
            if (!Array.isArray(recheckTeamId) || recheckTeamId.length !== 1) {
                throw typeof recheckTeamId === 'string' ? recheckTeamId : "You do not have access to this team.";
            }

            const recheckName = await this.dataSource
            .getRepository(Templates)
            .createQueryBuilder("templates")
            .where("templates.teamId = :teamId", { teamId: dto.teamId })
            .andWhere("LOWER(templates.templateName) = LOWER(:templateName)", { templateName: dto.templateName.trim() })
            .getCount();

            if (recheckName > 0) {
                throw "This template name already used, please try another template name.";
            }   

            const createTemplate = await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(Templates)
            .values({
                templateName: dto.templateName.trim(),
                team: dto.teamId,
                templateDescription: dto.description,
            }).execute();

            if (!createTemplate.identifiers.length) {
                throw "Have something wrong in creating progess, please try again later.";
            }

            return {
                id: createTemplate.identifiers[0].id,
                templateName: dto.templateName.trim()
            }
        } catch (error) {
            throw error;
        }
    }

    async findTemplatesByTeamId(teamId: string, user: UserInfoType) {
        try {
            const recheckTeam = await findUserInTeam({
                teamId,
                user,
                datasource: this.dataSource,
            });

            if (!Array.isArray(recheckTeam) || recheckTeam.length !== 1) {
                throw typeof recheckTeam === 'string' ? recheckTeam : "You do not have access to this team.";
            }

            const templates = await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder("templates")
                .leftJoinAndSelect("templates.team", "team")
                .where("templates.teamId = :teamId", { teamId })
                .orderBy("templates.createdAt", "DESC")
                .getMany();

            return templates;
        } catch (error) {
            throw error;
        }
    }

    async findOneByTemplateId(templateId: string, user: UserInfoType) {
        try {
            const template = await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder("templates")
                .leftJoinAndSelect("templates.team", "team")
                .where("templates.id = :templateId", { templateId })
                .getOne();

            if (!template) {
                throw "Template not found.";
            }

            const teamId = (template.team as any)?.id || (template as any).teamId;
            const recheckTeam = await findUserInTeam({
                teamId,
                user,
                datasource: this.dataSource,
            });

            if (!Array.isArray(recheckTeam) || recheckTeam.length !== 1) {
                throw typeof recheckTeam === 'string' ? recheckTeam : "You do not have access to this template.";
            }

            return template;
        } catch (error) {
            throw error;
        }
    }

    async updateByTemplateId(templateId: string, dto: UpdateTemplateDTO, user: UserInfoType) {
        try {
            const template = await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder("templates")
                .leftJoinAndSelect("templates.team", "team")
                .where("templates.id = :templateId", { templateId })
                .getOne();

            if (!template) {
                throw "Template not found.";
            }

            const teamId = (template.team as any)?.id || (template as any).teamId;
            const recheckTeam = await findUserInTeam({
                teamId,
                user,
                datasource: this.dataSource,
            });

            if (!Array.isArray(recheckTeam) || recheckTeam.length !== 1) {
                throw typeof recheckTeam === 'string' ? recheckTeam : "You do not have access to update this template.";
            }

            const updateData: Partial<Templates> = {};

            if (dto.templateName !== undefined) {
                const trimmedName = dto.templateName.trim();
                if (trimmedName.toLowerCase() !== template.templateName.trim().toLowerCase()) {
                    const recheckName = await this.dataSource
                        .getRepository(Templates)
                        .createQueryBuilder("templates")
                        .where("templates.teamId = :teamId", { teamId })
                        .andWhere("templates.id != :templateId", { templateId })
                        .andWhere("LOWER(templates.templateName) = LOWER(:templateName)", { templateName: trimmedName })
                        .getCount();

                    if (recheckName > 0) {
                        throw "This template name already used, please try another template name.";
                    }
                }
                updateData.templateName = trimmedName;
            }

            const desc = dto.description ?? dto.templateDescription;
            if (desc !== undefined) {
                updateData.templateDescription = desc;
            }

            if (Object.keys(updateData).length === 0) {
                throw "At least one field (templateName or description) must be provided for update.";
            }

            await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder()
                .update(Templates)
                .set(updateData)
                .where("id = :templateId", { templateId })
                .execute();

            const updatedTemplate = await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder("templates")
                .leftJoinAndSelect("templates.team", "team")
                .where("templates.id = :templateId", { templateId })
                .getOne();

            return updatedTemplate;
        } catch (error) {
            throw error;
        }
    }

    async deleteByTemplateId(templateId: string, user: UserInfoType) {
        try {
            const template = await this.dataSource
                .getRepository(Templates)
                .createQueryBuilder("templates")
                .leftJoinAndSelect("templates.team", "team")
                .where("templates.id = :templateId", { templateId })
                .getOne();

            if (!template) {
                throw "Template not found.";
            }

            const teamId = (template.team as any)?.id || (template as any).teamId;
            const recheckTeam = await findUserInTeam({
                teamId,
                user,
                datasource: this.dataSource,
            });

            if (!Array.isArray(recheckTeam) || recheckTeam.length !== 1) {
                throw typeof recheckTeam === 'string' ? recheckTeam : "You do not have access to delete this template.";
            }

            await this.dataSource
                .getRepository(Templates)
                .softDelete(templateId);

            return {
                id: templateId,
                deleted: true,
            };
        } catch (error) {
            throw error;
        }
    }
}
