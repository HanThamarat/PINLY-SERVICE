import { InitialTeamRoleTable } from "./team-role.js";

export default async function dataInitialize() {
    try {
        await InitialTeamRoleTable();
    } catch (err: any) {
        return err;
    }
}