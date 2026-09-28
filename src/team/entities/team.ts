import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}

export type CreateTeamRoleInput = Pick<TeamRole, "nameEn" | "nameTh">;