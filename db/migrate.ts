import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"
import { env } from '../constants.ts'

const sql = neon(env.DB_CONNECTION_STRING!)
const db = drizzle(sql)

const main = async () => {
    try {
        await migrate(db, {
            migrationsFolder: "./migrations",
        });

        console.log("Migration successful");
    } catch (error) {
        console.error(error);
    }
};

main();