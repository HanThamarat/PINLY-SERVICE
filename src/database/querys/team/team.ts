import { UserInfoType } from "../../../hooks/ecrypt.js";
import { DataSource } from "typeorm";

interface findUserInTeamProps {
    teamId: string;
    user: UserInfoType;
    datasource: DataSource;
}

export const findUserInTeam = async (props: findUserInTeamProps) => {
    try {
        const queryResult = await props.datasource.query(`
            select count(u.id) as userCount
            from ((team_member tm left join users u on u.id = tm."userId")
                left join team t on tm."teamIdId" = t.id)
            where u.id = $1 and t.id = $2
            group by u.id 
        `, [props.user.userId, props.teamId]);

        if (queryResult.length === 0) {
            throw "This team id don't have in the systems, please try again later.";
        }

        return queryResult;
    } catch (error) {
        return error;
    }
}