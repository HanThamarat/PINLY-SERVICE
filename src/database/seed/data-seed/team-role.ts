import { DataSource } from "typeorm";
import { CreateTeamRoleInput, TeamRole } from "../../../team/entities/team.js";

export const teamRole = async (datasource: DataSource) => {
    try {
        const recheckUser = await datasource.createQueryBuilder(TeamRole, "teamRole").getCount();

        if (recheckUser > 0) {
            console.log("✅ Seeding Default Team Role Completed.");
            return;
        }

        const data: CreateTeamRoleInput[] = [
            {
                nameEn: "Owner",
                nameTh: "ผู้สร้าง"
            },
            {
                nameEn: "Administrator",
                nameTh: "ผู้ดูแล"
            },
            {
                nameEn: "Member",
                nameTh: "สมาชิก"
            },
        ];

        const creteNewTeamRole = await datasource
        .createQueryBuilder()
        .insert()
        .into(TeamRole)
        .values(data)
        .execute();

        if (!creteNewTeamRole) {
            console.log("⚠️ Seeding Default Team Role Falied.");
            return;
        }
        
        console.log("✅ Seeding Default Team Role Completed.");
    } catch (error) {
        return error;
    }
}