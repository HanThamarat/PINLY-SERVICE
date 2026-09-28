import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module.js";
import { DataSource } from "typeorm";
import { teamRole } from "./data-seed/team-role.js";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const datasource = app.get(DataSource);

    try {

        const teamRoleSeed = await teamRole(datasource);

        console.log('🚀 Seeding complete');
    } catch (err) {
        console.error('⚠️ Seeding failed', err);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}

bootstrap();