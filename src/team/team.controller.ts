import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateNewTeamDTO } from './dto/team.dto.js';
import { TeamService } from './team.service.js';
import { SetErrResponse, SetResponse } from '../hooks/response.js';
import { JWTDecrypt } from '../hooks/ecrypt.js';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post("createteam")
    async createTeam(@Request() req: any, @Body() createNewteamDTO: CreateNewTeamDTO) {
        try {
            const userInfo = await JWTDecrypt(req);
            
            const result = await this.teamService.createTeam(createNewteamDTO, userInfo);

            return SetResponse({
                status: 201,
                message: "Create a new team successfully.",
                body: result
            });
        } catch (err: any) {
            return SetErrResponse({
                status: 400,
                message: "Create a new team failed.",
                err: err,
            })
        }
    }
}
