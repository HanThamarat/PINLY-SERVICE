import { z } from "zod";

export const createTemplateResultSchema = z.object({
    id: z.string(),
    templateName: z.string(),
});

export type createTemplateResultType = z.infer<typeof createTemplateResultSchema>;