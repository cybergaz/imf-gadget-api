import { defineConfig } from 'drizzle-kit'
import "dotenv/config"

// via connection params
export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.POSTGRES_HOST!,
        port: process.env.POSTGRES_PORT! ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
    },
    schema: ["./src/models/*"]
})
