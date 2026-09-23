import { Injectable } from '@nestjs/common';
import { CreateNewTeamDTO } from './dto/team.dto.js';
import { UserInfoType } from '../hooks/ecrypt.js';
import { DataSource } from 'typeorm';
import { Team } from './entities/team.js';

@Injectable()
export class TeamService {
    constructor(private readonly dataSource: DataSource) {}

    async createTeam(createDTO: CreateNewTeamDTO, user: UserInfoType) {
        try {
            const createNew = await this.dataSource.transaction(async (tx) => {
                const CreateTeam = tx.create(Team, {
                    teamName: createDTO.teamName,
                    description: createDTO.descrition,
                    status: createDTO.status
                });
                const saveTeam = await tx.save(CreateTeam);

                if (!saveTeam) {
                    throw "Create a new team failed.";
                }
            })
        } catch (err: any) {
            return err;
        }
    }
}
