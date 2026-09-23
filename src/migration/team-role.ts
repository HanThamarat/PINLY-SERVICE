import { appDataSource } from "../libs/datasource.js";
import { TeamRole } from "../team/entities/team.js";



export const InitialTeamRoleTable = async () => {
    try {
        const recheck = await appDataSource.getRepository(TeamRole).count();

        
    } catch (err: any) {
        return err;
    }
}