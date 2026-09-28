import { Injectable } from '@nestjs/common';
import { CreateNewTeamDTO } from './dto/team.dto.js';
import { UserInfoType } from '../hooks/ecrypt.js';
import { DataSource } from 'typeorm';
import { Team, TeamMember, TeamRole } from './entities/team.js';

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

                const getTeamRole = await tx
                .getRepository(TeamRole)
                .createQueryBuilder("teamRole")
                .where("teamRole.nameEn = :nameEn", { nameEn: "Owner" })
                .getOne();

                if (!getTeamRole) {
                    throw "Get a defaul team role failed.";
                }

                const createTeamMember = tx.create(TeamMember, {
                    teamId: CreateTeam.id,
                    userId: user.userId,
                    role: getTeamRole.id,
                });

                const saveTeamMember = await tx.save(createTeamMember);
                
                if (!saveTeamMember) {
                    throw "Create team member failed.";
                }

                return CreateTeam;
            });

            return createNew;
        } catch (err: any) {
            return err;
        }
    }

    async getMyTeam(user: UserInfoType) {
        try {

            const findMyTeam = await this.dataSource.query(`
                select u.id as userId, u."name" as name, json_agg(
                    json_build_object(
                        'teamName', t."teamName",
                        'roleEn', tr."nameEn",
                        'roleTh', tr."nameTh"
                    )
                ) as teams
                from (((team_member tm left join users u on tm."userId" = u.id)
                    left join team t on tm."teamIdId" = t.id)
                    left join team_role tr on tm."roleId" = tr.id)
                where u.id = $1
                group by u.id
            `, [user.userId]);

            
            if (findMyTeam.length === 0) {
                throw "Don't have team in your account."
            }
            
            return findMyTeam[0]
        } catch (err) {
            return err;
        }
    }
}
