import { load } from "https://deno.land/std@0.181.0/dotenv/mod.ts"

const localEnv = await load({ allowEmptyValues: true })

export const env = {
    DB_CONNECTION_STRING: localEnv.DB_CONNECTION_STRING || Deno.env.get('DB_CONNECTION_STRING'),
    API_AUTHORIZATION_KEY: localEnv.API_AUTHORIZATION_KEY || Deno.env.get('API_AUTHORIZATION_KEY')
}
