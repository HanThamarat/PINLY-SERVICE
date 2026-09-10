import { Module } from '@nestjs/common';
import { TeamService } from './team.service.js';
import { TeamController } from './team.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team, TeamMember, TeamRole } from './entities/team.js';

@Module({
    imports: [TypeOrmModule.forFeature([
        Team, TeamMember, TeamRole
    ])],
    providers: [TeamService],
    controllers: [TeamController]
})
export class TeamModule {}
