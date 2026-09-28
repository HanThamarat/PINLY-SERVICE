import z from "zod";

export const createTeamResponseSchema = z.object({
    teamName: z.string(),
    description: z.string().nullable(),
});