import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { teamRole } from "../../database/seed/data-seed/team-role.js";

@Entity()
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    teamName: string

    @Column({ nullable: true })
    description: string

    @Column({ default: true })
    status: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(() => TeamMember, (teamMember) => teamMember.teamId)
    teamMember: TeamMember[]

    @OneToMany(() => TeamInvite, (teamInvite) => teamInvite.team)
    teamInvite: TeamInvite[]
}

@Entity()
export class TeamMember {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => Team, (team) => team.id)
    teamId: string

    @Column()
    userId: string

    @ManyToOne(() => TeamRole, (teamRole) => teamRole.id)
    role: string
}

@Entity()
export class TeamRole {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    nameEn: string

    @Column()
    nameTh: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(() => TeamMember, (teamMember) => teamMember.role)
    roleTeamMember: TeamMember[]

    @OneToMany(() => TeamInvite, (teamInvite) => teamInvite.role)
    roleTeamInvite: TeamInvite[]
}

@Entity()
export class TeamInvite {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    inviteRefCode: string

    @Column()
    email: string

    @ManyToOne(() => Team, (team) => team.id)
    team: string

    @ManyToOne(() => TeamRole, (teamRole) => teamRole.id)
    role: string

    @Column()
    expiredAt: Date
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}

export type CreateTeamRoleInput = Pick<TeamRole, "nameEn" | "nameTh">;