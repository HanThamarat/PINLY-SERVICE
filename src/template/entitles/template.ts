import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "../../team/entities/team.js";

@Entity()
export class Templates {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    templateName: string

    @Column({ nullable: true })
    templateDescription: string

    @ManyToOne(() => Team, (team) => team.id)
    team: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}