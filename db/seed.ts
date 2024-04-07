import { strategies } from "./schema.ts"
import { drizzle } from "npm:drizzle-orm/neon-http"
import { neon } from "npm:@neondatabase/serverless"
import * as schema from "./schema.ts"
import { env } from '../constants.ts'

const sql = neon(env.DB_CONNECTION_STRING!)

const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("Seeding database")
        // Delete all data
        await db.delete(strategies)

        await db.insert(strategies).values([{
            id: '63f862da-d4ae-4548-8820-4b9f07eb8174',
            name: 'ICHIMOKU_WILLIAMS_LONG'
        }])
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed database");
    }
};

main();